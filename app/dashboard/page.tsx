import { auth } from "@/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import FoodSearch from "@/components/foods/FoodSearch";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import EntriesList from "@/components/dashboard/EntriesList";
import EmptyState from "@/components/dashboard/EmptyState";
import { addMealEntryAction, removeEntryAction } from "./actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const h = await headers();
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const host = h.get("host")!;
  const origin = `${proto}://${host}`;

  // Début de journée
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Total kcal du jour
  const consumedToday = await prisma.mealEntry.aggregate({
    _sum: { calories: true },
    where: {
      user: { email: session.user.email },
      eatenAt: { gte: startOfToday },
    },
  });

  // Liste des entrées du jour
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

  // Métabolisme / objectif
  type Ok = {
    ok: true;
    results: {
      bmr: number;
      tdee: number;
      target: number;
      activityFactor: number;
      goalFactor: number;
    };
    profile: { goal: string; activityLevel: string };
  };
  type Err = { ok: false; missing?: string[]; error?: string };

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

  const total = consumedToday._sum.calories ?? 0;
  const target = stats && "results" in stats ? stats.results.target : null;
  const remaining = target != null ? Math.max(0, target - total) : null;

  // Bridge universel vers addMealEntryAction
  async function addMealBridge(formData: FormData) {
    "use server";
    const arity = (addMealEntryAction as any).length;
    if (arity >= 2) {
      return (addMealEntryAction as any)({}, formData);
    }
    return (addMealEntryAction as any)(formData);
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Recherche + ajout */}
      <FoodSearch addAction={addMealBridge} />

      {/* Cartes récap */}
      <DashboardSummary total={total} target={target} remaining={remaining} />

      {/* Liste des entrées */}
      {entries.length > 0 ? (
        <EntriesList entries={entries} removeAction={removeEntryAction} />
      ) : (
        <EmptyState />
      )}
    </section>
  );
}
