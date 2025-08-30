// app/dashboard/page.tsx
import { auth } from "@/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import FoodSearch from "@/components/foods/FoodSearch";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import EntriesList from "@/components/dashboard/EntriesList";
import EmptyState from "@/components/dashboard/EmptyState";
import { addMealEntryAction, removeEntryAction } from "./actions";

// Server Component
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  // Construire l’origin absolu pour le fetch server-side (avec cookies)
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${h.get("host")}`;

  // Début de journée (heure serveur)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Entrées du jour
  const entries = await prisma.mealEntry.findMany({
    where: {
      user: { email: session.user.email },
      eatenAt: { gte: startOfToday },
    },
    orderBy: { eatenAt: "desc" },
    select: {
      id: true,
      eatenAt: true,
      amount: true,
      unit: true,
      calories: true,
      food: { select: { name: true, brands: true } },
    },
  });

  // Total kcal du jour (évite .aggregate qui plante chez toi)
  const total = entries.reduce((sum, e) => sum + (e.calories ?? 0), 0);

  // Métabolisme / objectif via API interne
  type Ok = {
    ok: true;
    results: {
      bmr: number;
      tdee: number;
      target: number;
      activityFactor: number;
      goalFactor: number;
    };
  };
  type Err = { ok: false; error: string };

  let stats: Ok | Err | null = null;
  try {
    const res = await fetch(`${origin}/api/metabolism`, {
      cache: "no-store",
      headers: { cookie: h.get("cookie") ?? "" },
    });
    stats = (await res.json()) as Ok | Err;
  } catch {
    stats = { ok: false, error: "Impossible de charger les stats." };
  }

  const target = stats && "results" in stats ? stats.results.target : null;
  const remaining = target != null ? Math.max(0, target - total) : null;

  // Bridge vers la server action (compatible 2 signatures)
  async function addMealBridge(formData: FormData) {
    "use server";
    const arity = (addMealEntryAction as unknown as { length: number }).length;
    if (arity >= 2) {
      // @ts-expect-error — compat ancienne signature (prevState, formData)
      return addMealEntryAction({}, formData);
    }
    // @ts-expect-error — compat nouvelle signature (formData)
    return addMealEntryAction(formData);
  }

  return (
    <section className="space-y-6">
      <FoodSearch addAction={addMealBridge} />
      <DashboardSummary total={total} target={target} remaining={remaining} />
      {entries.length > 0 ? (
        <EntriesList entries={entries} removeAction={removeEntryAction} />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
