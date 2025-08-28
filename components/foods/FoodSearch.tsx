// components/foods/FoodSearch.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchInput from "./search/SearchInput";
import SearchResults from "./search/SearchResults";
import SelectedFoodForm from "./search/SelectedFoodForm";

type Result = {
  id: string;
  name: string;
  brand?: string | null;
  caloriesPer100g?: number | null;
};

type Props = {
  /** Server Action d’ajout dans le journal */
  addAction: (formData: FormData) => Promise<any>;
  /** Endpoint de recherche (JSON) — par défaut /api/foods/search */
  endpoint?: string;
  /** Chemin vers la création — par défaut /dashboard/foods/new */
  createPath?: string;
};

export default function FoodSearch({
  addAction,
  endpoint = "/api/foods/search",
  createPath = "/dashboard/foods/new",
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [selected, setSelected] = useState<Result | null>(null);
  const [isPending, startTransition] = useTransition();

  // Quand la requête est vidée on ferme la fenêtre de sélection
  useEffect(() => {
    if (!query.trim()) setSelected(null);
  }, [query]);

  // Recherche (debounced côté input ; ici on ne fait que fetch sur changement de query)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch(`${endpoint}?q=${encodeURIComponent(query)}`, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok) {
          setResults([]);
          return;
        }
        const data = (await res.json()) as Result[] | { items: Result[] };
        setResults(Array.isArray(data) ? data : data.items ?? []);
      } catch {
        setResults([]);
      }
    });
  }, [query, endpoint]);

  const hasTyped = query.trim().length > 0;
  const createHref = hasTyped
    ? `${createPath}?q=${encodeURIComponent(query.trim())}`
    : createPath;

  return (
    <div className="space-y-4">
      <SearchInput value={query} onChange={setQuery} autoFocus />

      {/* Vue "aliment sélectionné" -> formulaire d’ajout au journal */}
      {selected && hasTyped ? (
        <div className="space-y-3">
          <SelectedFoodForm
            selected={selected}
            addAction={addAction}
            onAdded={() => {
              // Ferme la fenêtre + reset la recherche + refresh le dashboard
              setSelected(null);
              setQuery("");
              router.refresh();
            }}
          />
          <button
            type="button"
            className="text-xs text-gray-500 underline"
            onClick={() => setSelected(null)}
          >
            ← changer d’aliment
          </button>
        </div>
      ) : (
        <>
          {/* Pas de saisie */}
          {!hasTyped ? (
            <SearchResults
              items={results}
              loading={isPending}
              onPick={(it) => setSelected(it)}
              emptyText="Commence à taper pour chercher un aliment"
            />
          ) : // Saisie mais aucun résultat → proposer la création
          results.length === 0 ? (
            <div className="space-y-3 rounded-md border p-4">
              <div className="text-sm text-gray-600">
                Aucun résultat pour{" "}
                <span className="font-medium text-gray-900">
                  “{query.trim()}”
                </span>
                .
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={createHref}
                  className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Créer cet aliment
                </Link>
                <span className="text-xs text-gray-500">
                  Saisis le nom, la marque, le code-barres et les calories.
                </span>
              </div>
            </div>
          ) : (
            // Résultats disponibles
            <SearchResults
              items={results}
              loading={isPending}
              onPick={(it) => setSelected(it)}
              emptyText="Aucun résultat pour cette recherche"
            />
          )}
        </>
      )}
    </div>
  );
}
