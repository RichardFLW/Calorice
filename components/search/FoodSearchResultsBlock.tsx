import Link from "next/link";
import SearchResults from "./SearchResults";

type Result = {
  id: string;
  name: string;
  brand?: string | null;
  caloriesPer100g?: number | null;
};

type Props = {
  query: string;
  results: Result[];
  loading: boolean;
  createPath: string;
  onPick: (it: Result) => void;
};

export default function FoodSearchResultsBlock({
  query,
  results,
  loading,
  createPath,
  onPick,
}: Props) {
  const hasTyped = query.trim().length > 0;
  const createHref = hasTyped
    ? `${createPath}?q=${encodeURIComponent(query.trim())}`
    : createPath;

  if (!hasTyped) {
    return (
      <SearchResults
        items={results}
        loading={loading}
        onPick={onPick}
        emptyText="Commence à taper pour chercher un aliment"
      />
    );
  }

  if (results.length === 0) {
    return (
      <div className="space-y-3 rounded-md border p-4">
        <div className="text-sm text-gray-600">
          Aucun résultat pour{" "}
          <span className="font-medium text-gray-900">“{query.trim()}”</span>.
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
    );
  }

  return (
    <SearchResults
      items={results}
      loading={loading}
      onPick={onPick}
      emptyText="Aucun résultat pour cette recherche"
    />
  );
}
