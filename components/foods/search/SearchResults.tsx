// components/foods/search/SearchResults.tsx
"use client";

type Result = {
  id: string;
  name: string;
  brand?: string | null;
  caloriesPer100g?: number | null;
};

type Props = {
  items: Result[];
  loading?: boolean;
  onPick: (item: Result) => void;
  emptyText?: string;
};

/**
 * Liste des résultats (états: chargement / vide / liste).
 */
export default function SearchResults({
  items,
  loading,
  onPick,
  emptyText = "Aucun résultat",
}: Props) {
  if (loading) {
    return (
      <div className="rounded-md border p-4 text-sm text-gray-600">
        Recherche…
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="rounded-md border p-4 text-sm text-gray-500">
        {emptyText}
      </div>
    );
  }

  return (
    <ul className="divide-y rounded-md border">
      {items.map((it) => (
        <li key={it.id} className="flex items-center justify-between gap-3 p-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">
              {it.name}
              {it.brand ? (
                <span className="ml-2 truncate text-gray-500">
                  · {it.brand}
                </span>
              ) : null}
            </div>
            {typeof it.caloriesPer100g === "number" && (
              <div className="text-xs text-gray-500">
                {it.caloriesPer100g} kcal / 100g
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => onPick(it)}
            className="shrink-0 rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
          >
            Choisir
          </button>
        </li>
      ))}
    </ul>
  );
}
