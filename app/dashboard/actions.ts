"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { computeCalories } from "@/lib/computeCalories";

export type AddMealState = {
  ok?: boolean;
  error?: string;
};

// ➤ Ajouter une entrée repas
export async function addMealEntryAction(
  _prev: AddMealState,
  formData: FormData
): Promise<AddMealState> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Non connecté." };

  const foodId = String(formData.get("foodId") ?? "");
  const unit = String(formData.get("unit") ?? "g") as "g" | "ml" | "portion";
  const amount = Number(formData.get("amount") ?? 0);
  const eatenAtRaw = formData.get("eatenAt") as string | null;

  if (!foodId) return { error: "Aliment manquant." };
  if (!amount || amount <= 0) return { error: "Quantité invalide." };

  const food = await prisma.food.findUnique({
    where: { id: foodId },
    select: {
      id: true,
      caloriesPer100g: true,
      caloriesPerPortion: true,
      servingSize: true,
      fatPer100g: true,
      carbsPer100g: true,
      proteinPer100g: true,
      fatPerPortion: true,
      carbsPerPortion: true,
      proteinPerPortion: true,
      micronutrientsPer100g: true,
      micronutrientsPerPortion: true,
    },
  });
  if (!food) return { error: "Aliment introuvable." };

  const calories = computeCalories({
    caloriesPer100g: food.caloriesPer100g,
    caloriesPerPortion: food.caloriesPerPortion,
    servingSize: food.servingSize,
    unit,
    amount,
  });
  if (calories == null)
    return { error: "Impossible de calculer les calories pour cet aliment." };

  // Optionnel: snapshot des macros
  let macrosSnapshot: Record<string, number> | undefined;
  if (unit === "portion") {
    if (
      food.fatPerPortion != null ||
      food.carbsPerPortion != null ||
      food.proteinPerPortion != null
    ) {
      macrosSnapshot = {
        ...(food.fatPerPortion != null
          ? { fat: food.fatPerPortion * amount }
          : {}),
        ...(food.carbsPerPortion != null
          ? { carbs: food.carbsPerPortion * amount }
          : {}),
        ...(food.proteinPerPortion != null
          ? { protein: food.proteinPerPortion * amount }
          : {}),
      };
    }
  } else {
    const factor = amount / 100;
    if (
      food.fatPer100g != null ||
      food.carbsPer100g != null ||
      food.proteinPer100g != null
    ) {
      macrosSnapshot = {
        ...(food.fatPer100g != null ? { fat: food.fatPer100g * factor } : {}),
        ...(food.carbsPer100g != null
          ? { carbs: food.carbsPer100g * factor }
          : {}),
        ...(food.proteinPer100g != null
          ? { protein: food.proteinPer100g * factor }
          : {}),
      };
    }
  }

  const eatenAt = eatenAtRaw ? new Date(eatenAtRaw) : new Date();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return { error: "Utilisateur introuvable." };

  await prisma.mealEntry.create({
    data: {
      userId: user.id,
      foodId: food.id,
      eatenAt,
      amount,
      unit,
      calories,
      macrosSnapshot: macrosSnapshot ? (macrosSnapshot as any) : undefined,
    },
  });

  return { ok: true };
}

// ➤ Récupérer toutes les entrées de l’utilisateur
export async function getEntries() {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return [];

  return prisma.mealEntry.findMany({
    where: { userId: user.id },
    orderBy: { eatenAt: "desc" },
    include: {
      food: true,
    },
  });
}

// ➤ Supprimer une entrée
export async function removeEntryAction(_prev: any, formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;

  const session = await auth();
  if (!session?.user?.email) return;

  // Vérification propriétaire
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

  await prisma.mealEntry.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}
