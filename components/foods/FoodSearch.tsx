// components/foods/FoodSearch.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Food = {
  id: string;
  name: string;
  brands: string | null;
  barcode: string | null;
  servingSize: number | null;
  servingUnit: string | null;
  caloriesPer100g: number | null;
  caloriesPerPortion: number | null;
};

type Props = {
  addAction: (
    prev: any,
    formData: FormData
  ) => Promise<{ ok?: boolean; error?: string }>;
};

export default function FoodSearch({ addAction }: Props) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Food | null>(null);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Debounce
  const debounced = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError(null);
      if (!debounced) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/foods/search?q=${encodeURIComponent(debounced)}`
        );
        const data = (await res.json()) as { ok: boolean; items: Food[] };
        if (!cancelled) {
          setResults(data.ok ? data.items : []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erreur réseau");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const t = setTimeout(run, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [debounced]);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("foodId", selected.id);

    startTransition(async () => {
      const res = await addAction({}, fd);
      if (res?.ok) {
        setQ("");
        setResults([]);
        setSelected(null);
        form.reset();
        router.refresh(); // met à jour les totaux serveur
      } else if (res?.error) {
        alert(res.error);
      }
    });
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 font-medium">Ajouter un aliment</div>

      {/* Recherche */}
      <input
        type="search"
        placeholder="Rechercher un aliment, une marque, un code barre…"
        className="w-full rounded-md border px-3 py-2 text-sm"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {loading && <p className="mt-2 text-sm text-gray-500">Recherche…</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* Résultats */}
      {results.length > 0 ? (
        <ul className="mt-3 divide-y rounded-md border">
          {results.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-2 p-2 hover:bg-gray-50"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {f.name}{" "}
                  {f.brands ? (
                    <span className="text-gray-500">— {f.brands}</span>
                  ) : null}
                </div>
                <div className="truncate text-xs text-gray-500">
                  {f.caloriesPer100g != null
                    ? `${f.caloriesPer100g} kcal/100g`
                    : "—"}{" "}
                  {f.caloriesPerPortion != null
                    ? `• ${f.caloriesPerPortion} kcal/portion`
                    : ""}
                </div>
              </div>
              <button
                onClick={() => setSelected(f)}
                className="shrink-0 rounded-md border px-3 py-1 text-sm"
              >
                Choisir
              </button>
            </li>
          ))}
        </ul>
      ) : debounced && !loading ? (
        <div className="mt-3 rounded-md border p-3 text-sm">
          Aucun résultat pour « {debounced} ».{" "}
          <a href="/dashboard/foods/new" className="underline">
            Ajouter un aliment
          </a>
        </div>
      ) : null}

      {/* Formulaire d’ajout */}
      {selected && (
        <form
          onSubmit={handleAdd}
          className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]"
        >
          <input type="hidden" name="foodId" value={selected.id} />
          <div className="sm:col-span-1">
            <div className="text-sm font-medium">
              {selected.name}
              {selected.brands ? (
                <span className="text-gray-500"> — {selected.brands}</span>
              ) : null}
            </div>
            <div className="text-xs text-gray-500">
              {selected.caloriesPer100g != null
                ? `${selected.caloriesPer100g} kcal/100g`
                : "—"}{" "}
              {selected.caloriesPerPortion != null
                ? `• ${selected.caloriesPerPortion} kcal/portion`
                : ""}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              name="amount"
              type="number"
              min={0}
              step="0.1"
              placeholder={
                selected.servingSize ? String(selected.servingSize) : "100"
              }
              className="w-28 rounded-md border px-3 py-2 text-sm"
              required
            />
            <select name="unit" className="rounded-md border px-2 py-2 text-sm">
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="portion">portion</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-50"
          >
            {isPending ? "Ajout…" : "Ajouter"}
          </button>
        </form>
      )}
    </div>
  );
}
