// components/dashboard/EntriesList.tsx
import * as React from "react";

type Entry = {
  id: string;
  eatenAt: Date;
  amount?: number | null;
  unit?: string | null;
  calories?: number | null;
  food?: { name: string | null; brands?: string | null } | null;
};

type RemoveAction = (
  formData: FormData
) => Promise<{ ok?: boolean; error?: string } | void>;

export default function EntriesList({
  entries,
  removeAction,
}: {
  entries: Entry[];
  removeAction: RemoveAction;
}) {
  if (!entries?.length) return null;

  return (
    <div className="rounded-xl border divide-y">
      {entries.map((e) => {
        const title = e.food?.name?.trim() || "Entrée";
        const subtitle =
          e.food?.brands?.trim() ||
          [
            e.amount != null ? `${e.amount}${e.unit ?? ""}` : null,
            e.calories != null ? `${e.calories} kcal` : null,
          ]
            .filter(Boolean)
            .join(" · ");

        return (
          <div
            key={e.id}
            className="flex items-center justify-between gap-3 p-3"
          >
            <div className="min-w-0">
              <div className="font-medium truncate">{title}</div>
              <div className="text-sm text-muted-foreground truncate">
                {subtitle || "—"}
              </div>
            </div>
            <form action={removeAction}>
              <input type="hidden" name="id" value={e.id} />
              <button
                className="rounded-lg border px-3 py-1 hover:bg-gray-50"
                type="submit"
              >
                Supprimer
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
