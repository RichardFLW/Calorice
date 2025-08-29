type Props = {
  total: number;
  target: number | null;
  remaining: number | null;
};

export default function DashboardSummary({ total, target, remaining }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border p-4">
        <div className="text-xs text-gray-500">Consommé aujourd’hui</div>
        <div className="mt-1 text-2xl font-semibold">{total} kcal</div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="text-xs text-gray-500">Objectif (TDEE/target)</div>
        <div className="mt-1 text-2xl font-semibold">
          {target != null ? `${target} kcal` : "—"}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="text-xs text-gray-500">Restant</div>
        <div className="mt-1 text-2xl font-semibold">
          {remaining != null ? `${remaining} kcal` : "—"}
        </div>
      </div>
    </div>
  );
}
