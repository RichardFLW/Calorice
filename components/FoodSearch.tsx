"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import SearchInput from "./search/SearchInput";
import FoodSearchResultsBlock from "./search/FoodSearchResultsBlock";
import FoodSelectedBlock from "./search/FoodSelectedBlock";

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

  // Quand la requête est vidée → fermer la sélection
  useEffect(() => {
    if (!query.trim()) setSelected(null);
  }, [query]);

  // Recherche
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

  return (
    <div className="space-y-4">
      <SearchInput value={query} onChange={setQuery} autoFocus />

      {selected && hasTyped ? (
        <FoodSelectedBlock
          selected={selected}
          addAction={addAction}
          onReset={() => {
            setSelected(null);
            setQuery("");
            router.refresh();
          }}
        />
      ) : (
        <FoodSearchResultsBlock
          query={query}
          results={results}
          loading={isPending}
          createPath={createPath}
          onPick={(it) => setSelected(it)}
        />
      )}
    </div>
  );
}
