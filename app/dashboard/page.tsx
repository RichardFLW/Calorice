// app/dashboard/page.tsx
import { auth } from "@/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import FoodSearch from "@/components/foods/FoodSearch";
import { addMealEntryAction } from "./actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const h = await headers();
  const proto =
    h.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const host = h.get("host")!;
  const origin = `${proto}://${host}`;

  // Début de journée (serveur). Si besoin, on ajustera au fuseau de l’utilisateur.
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

  // Bridge universel → (formData) ou (prevState, formData)
  async function addMealBridge(formData: FormData) {
    "use server";
    const arity = (addMealEntryAction as any).length;
    if (arity >= 2) {
      return (addMealEntryAction as any)({}, formData);
    }
    return (addMealEntryAction as any)(formData);
  }

  // ❗️Fix: Server Action en 1 seul paramètre (FormData)
  async function removeEntryAction(formData: FormData) {
    "use server";
    const id = String(formData.get("id") ?? "");
    if (!id) return;

    const session = await auth();
    if (!session?.user?.email) return;

    // Vérifie la propriété avant suppression
    const entry = await prisma.mealEntry.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!entry) return;

    const me = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!me || entry.userId !== me.id) return;

    await prisma.mealEntry.delete({ where: { id } });
    revalidatePath("/dashboard");
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Recherche + ajout */}
      <FoodSearch addAction={addMealBridge} />

      {/* Cartes récap */}
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
          {stats && !("ok" in stats && stats.ok) && (
            <p className="mt-1 text-xs text-gray-500">
              {"error" in (stats as Err) && (stats as Err).error
                ? (stats as Err).error
                : "Profil incomplet. Renseigne ton profil pour activer le calcul."}
            </p>
          )}
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

      {/* Journal du jour */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-700">
          Journal d’aujourd’hui
        </h2>
        {entries.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune entrée pour le moment.</p>
        ) : (
          <ul className="divide-y rounded-md border">
            {entries.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between gap-3 p-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {e.food.name}
                    {e.food.brands ? (
                      <span className="ml-2 truncate text-gray-500">
                        · {e.food.brands}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-gray-500">
                    {e.amount ?? "—"} {e.unit ?? ""}
                    {typeof e.calories === "number"
                      ? ` — ${e.calories} kcal`
                      : ""}
                    {" · "}
                    {new Date(e.eatenAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <form action={removeEntryAction}>
                  <input type="hidden" name="id" value={e.id} />
                  <button
                    type="submit"
                    className="shrink-0 rounded-md border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Supprimer
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
