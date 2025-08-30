// components/foods/FoodSearch.tsx
"use client";

import * as React from "react";

type AddAction = (
  formData: FormData
) => Promise<{ ok?: boolean; error?: string } | void>;
type Props = { addAction: AddAction };

export type FoodItem = {
  id: string;
  name?: string | null;
  brands?: string | null;
  barcode?: string | null;
  servingSize?: number | null;
  servingUnit?: string | null;
  caloriesPer100g?: number | null;
  caloriesPerPortion?: number | null;
  fatPer100g?: number | null;
  carbsPer100g?: number | null;
  proteinPer100g?: number | null;
  fatPerPortion?: number | null;
  carbsPerPortion?: number | null;
  proteinPerPortion?: number | null;
};

export default function FoodSearch({ addAction }: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [items, setItems] = React.useState<FoodItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const debouncedQ = useDebouncedValue(q, 250);

  // Recherche
  React.useEffect(() => {
    let aborted = false;
    async function run() {
      setError(null);
      if (!debouncedQ.trim()) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/foods/search?q=${encodeURIComponent(debouncedQ)}`,
          {
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as { items?: FoodItem[] };
        if (!aborted) setItems(Array.isArray(data.items) ? data.items : []);
      } catch {
        if (!aborted) {
          setItems([]);
          setError("Recherche indisponible pour le moment.");
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    run();
    return () => {
      aborted = true;
    };
  }, [debouncedQ]);

  // Fermer la fenêtre après ajout
  const closeResults = React.useCallback(() => {
    setQ("");
    setItems([]);
    inputRef.current?.blur();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex-1">
        <label className="block text-sm font-medium">
          Rechercher un aliment
        </label>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ex. fromage blanc, riz, poulet…"
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Recherche…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Fenêtre de résultats — pas de message “Aucun résultat”, pas de CTA “Ajouter un aliment” */}
      {q.trim() && (
        <ul className="divide-y rounded-xl border">
          {items.map((it) => {
            const title = safeTruncate(it.name ?? "(Sans nom)", 80);
            const subtitle =
              (it.brands && it.brands.trim()) ||
              (it.barcode ? `EAN: ${it.barcode}` : "—");

            // Ajout direct avec valeurs par défaut
            const unit =
              it.servingUnit ??
              (it.caloriesPerPortion != null ? "portion" : "g");
            const amount =
              unit === "g" || unit === "ml" ? it.servingSize ?? 100 : 1;

            return (
              <li key={it.id} className="p-0">
                <form action={addAction} onSubmit={closeResults}>
                  <input type="hidden" name="foodId" value={it.id} />
                  <input type="hidden" name="unit" value={unit} />
                  <input type="hidden" name="amount" value={amount} />
                  <button
                    type="submit"
                    className="w-full text-left p-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    title="Ajouter au journal"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{title}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {safeTruncate(subtitle, 80)}
                      </div>
                    </div>
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function safeTruncate(v: unknown, max: number): string {
  const s = typeof v === "string" ? v : v == null ? "" : String(v);
  if (s.length <= max) return s;
  return s.slice(0, Math.max(0, max - 1)) + "…";
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
