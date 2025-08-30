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

  // Ligne ouverte pour saisir quantité/unité
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState<number>(100);
  const [unit, setUnit] = React.useState<"g" | "ml" | "portion">("g");

  const debouncedQ = useDebouncedValue(q, 250);

  // Recherche
  React.useEffect(() => {
    let aborted = false;
    async function run() {
      setError(null);
      if (!debouncedQ.trim()) {
        setItems([]);
        setActiveId(null);
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

  // Ouvrir l’éditeur quantité/unité en fixant les valeurs par défaut selon l’aliment
  const openEditor = (it: FoodItem) => {
    const defaultUnit =
      (it.servingUnit as "g" | "ml" | "portion") ??
      (it.caloriesPerPortion != null ? "portion" : "g");
    const defaultAmount =
      defaultUnit === "g" || defaultUnit === "ml" ? it.servingSize ?? 100 : 1;
    setUnit(defaultUnit);
    setAmount(defaultAmount);
    setActiveId(it.id);
  };

  // Fermer la fenêtre de résultats après ajout
  const closeResults = React.useCallback(() => {
    setQ("");
    setItems([]);
    setActiveId(null);
    inputRef.current?.blur();
  }, []);

  const qTrim = q.trim();

  return (
    <div className="space-y-4">
      <div className="flex-1">
        <label className="block text-sm font-medium">
          Rechercher un aliment
        </label>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            // retaper referme l’éditeur actif
            if (activeId) setActiveId(null);
          }}
          placeholder="Ex. fromage blanc, riz, poulet…"
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
        />
      </div>

      {loading && <p className="text-sm text-muted-foreground">Recherche…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Fenêtre de résultats */}
      {qTrim && (
        <ul className="divide-y rounded-xl border">
          {items.map((it) => {
            const isActive = activeId === it.id;
            const title = safeTruncate(it.name ?? "(Sans nom)", 80);
            const subtitle =
              (it.brands && it.brands.trim()) ||
              (it.barcode ? `EAN: ${it.barcode}` : "—");

            return (
              <li key={it.id} className="p-0">
                {/* Ligne cliquable */}
                <button
                  type="button"
                  onClick={() => openEditor(it)}
                  className={
                    "w-full text-left p-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none " +
                    (isActive ? "bg-gray-50/70" : "")
                  }
                  title="Choisir la quantité à ajouter"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {safeTruncate(subtitle, 80)}
                    </div>
                  </div>
                </button>

                {/* Éditeur quantité/unité (s’affiche après clic) */}
                {isActive && (
                  <div className="px-3 pb-3">
                    <form
                      action={addAction}
                      onSubmit={closeResults}
                      className="mt-2 flex flex-wrap items-end gap-2"
                    >
                      <input type="hidden" name="foodId" value={it.id} />
                      <div className="flex flex-col">
                        <label className="text-xs text-muted-foreground">
                          Quantité
                        </label>
                        <input
                          type="number"
                          name="amount"
                          inputMode="decimal"
                          step="0.1"
                          value={amount}
                          onChange={(e) =>
                            setAmount(Number(e.target.value || 0))
                          }
                          className="w-28 rounded-lg border px-2 py-1"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-xs text-muted-foreground">
                          Unité
                        </label>
                        <select
                          name="unit"
                          value={unit}
                          onChange={(e) =>
                            setUnit(e.target.value as "g" | "ml" | "portion")
                          }
                          className="w-28 rounded-lg border px-2 py-1"
                        >
                          <option value="g">g</option>
                          <option value="ml">ml</option>
                          <option value="portion">portion</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveId(null)}
                          className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-black px-3 py-1 text-white hover:opacity-90"
                        >
                          Ajouter
                        </button>
                      </div>
                    </form>
                  </div>
                )}
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
