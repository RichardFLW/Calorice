// app/dashboard/page.tsx
import { auth } from "@/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import FoodSearch from "@/components/foods/FoodSearch";
import { addMealEntryAction } from "./actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  // ----- API metabolism (BMR/TDEE/target)
  const h = headers();
  const host = h.get("host")!;
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const origin = `${protocol}://${host}`;
  const cookie = h.get("cookie") ?? "";

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
      headers: { cookie },
    });
    stats = (await res.json()) as any;
  } catch {
    stats = null;
  }

  // ----- Totaux du jour
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email ?? "" },
    select: { id: true },
  });
  let totalToday = 0;

  if (user) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const agg = await prisma.mealEntry.aggregate({
      where: {
        userId: user.id,
        eatenAt: { gte: start, lt: end },
      },
      _sum: { calories: true },
    });
    totalToday = Math.round(agg._sum.calories ?? 0);
  }

  const target =
    stats && "ok" in stats && stats.ok ? stats.results.target : null;
  const remaining =
    target != null ? Math.max(0, Math.round(target - totalToday)) : null;

  const missing =
    stats && "ok" in stats && !stats.ok ? stats.missing ?? [] : [];

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Bienvenue {session.user?.name ?? session.user?.email}</p>

      {/* Bandeau métabolisme */}
      {stats && "ok" in stats && stats.ok ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="text-xs text-gray-500">
              Métabolisme de base (BMR)
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {stats.results.bmr} kcal/j
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs text-gray-500">
              Apport de maintien (TDEE)
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {stats.results.tdee} kcal/j
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs text-gray-500">
              Objectif ({stats.profile.goal})
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {stats.results.target} kcal/j
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border p-4">
          <div className="text-sm">
            Renseigne d’abord ton profil pour calculer tes besoins.
          </div>
          {missing.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
          <a
            href="/dashboard/profile"
            className="mt-3 inline-block rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-900"
          >
            Compléter mon profil
          </a>
        </div>
      )}

      {/* Recherche + ajout d’aliments */}
      <FoodSearch addAction={addMealEntryAction} />

      {/* Totaux du jour */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="text-xs text-gray-500">
            Calories consommées aujourd’hui
          </div>
          <div className="mt-1 text-2xl font-semibold">{totalToday} kcal</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs text-gray-500">Calories restantes</div>
          <div className="mt-1 text-2xl font-semibold">
            {remaining != null ? `${remaining} kcal` : "—"}
          </div>
          {remaining == null && (
            <p className="mt-1 text-xs text-gray-500">
              Renseigne ton profil pour activer le calcul de l’objectif.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
