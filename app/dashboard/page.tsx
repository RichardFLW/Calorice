// app/dashboard/page.tsx
import { auth } from "@/auth";
import { headers } from "next/headers";
import { prisma, getEntriesDelegateOrNull } from "@/lib/prisma";
import FoodSearch from "@/components/foods/FoodSearch";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import EntriesList from "@/components/dashboard/EntriesList";
import EmptyState from "@/components/dashboard/EmptyState";
import { addMealEntryAction, removeEntryAction } from "./actions";

type MetabolismOk = {
  ok: true;
  results: {
    bmr: number;
    tdee: number;
    target: number;
    activityFactor: number;
    goalFactor: number;
  };
};
type MetabolismErr = { ok: false; error: string };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${h.get("host")}`;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const Entries = getEntriesDelegateOrNull(prisma);

  let entries: Array<{
    id: string;
    eatenAt: Date;
    amount?: number | null;
    unit?: string | null;
    calories?: number | null;
    food?: { name: string | null; brands?: string | null } | null;
  }> = [];

  if (Entries) {
    try {
      entries = (await Entries.findMany({
        where: {
          // @ts-expect-error selon schéma réel
          user: { email: session.user.email },
          // @ts-expect-error selon schéma réel
          eatenAt: { gte: startOfToday },
        },
        // @ts-expect-error selon schéma réel
        orderBy: { eatenAt: "desc" },
        select: {
          id: true,
          // @ts-expect-error selon schéma réel
          eatenAt: true,
          amount: true,
          unit: true,
          calories: true,
          // si la relation food n’existe pas, tu peux retirer ce bloc
          food: { select: { name: true, brands: true } },
        },
      })) as typeof entries;
    } catch {
      entries = [];
    }
  }

  const total = entries.reduce((sum, e) => sum + (e.calories ?? 0), 0);

  let stats: MetabolismOk | MetabolismErr | null = null;
  try {
    const res = await fetch(`${origin}/api/metabolism`, {
      cache: "no-store",
      headers: { cookie: h.get("cookie") ?? "" },
    });
    stats = (await res.json()) as MetabolismOk | MetabolismErr;
  } catch {
    stats = { ok: false, error: "Impossible de charger les stats." };
  }

  const target = stats && "results" in stats ? stats.results.target : null;
  const remaining = target != null ? Math.max(0, target - total) : null;

  return (
    <section className="space-y-6">
      {/* FoodSearch ajoute via addMealEntryAction (signature 1 arg) */}
      <FoodSearch addAction={addMealEntryAction} />
      <DashboardSummary total={total} target={target} remaining={remaining} />
      {entries.length > 0 ? (
        <EntriesList entries={entries} removeAction={removeEntryAction} />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
