// app/dashboard/actions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type AddMealState = {
  ok?: boolean;
  error?: string;
};

function computeCalories(opts: {
  caloriesPer100g?: number | null;
  caloriesPerPortion?: number | null;
  servingSize?: number | null; // ex: 30
  unit: "g" | "ml" | "portion";
  amount: number; // ex: 100 g, ou 1 portion
}): number | null {
  const { caloriesPer100g, caloriesPerPortion, servingSize, unit, amount } =
    opts;

  if (unit === "portion") {
    if (typeof caloriesPerPortion === "number") {
      return caloriesPerPortion * amount;
    }
    if (
      typeof caloriesPer100g === "number" &&
      typeof servingSize === "number" &&
      servingSize > 0
    ) {
      return (caloriesPer100g * servingSize * amount) / 100;
    }
    return null;
  }

  // g / ml
  if (typeof caloriesPer100g === "number") {
    return (caloriesPer100g * amount) / 100;
  }
  if (
    typeof caloriesPerPortion === "number" &&
    typeof servingSize === "number" &&
    servingSize > 0
  ) {
    // déduit les kcal/100g à partir de la portion
    const per100 = (caloriesPerPortion * 100) / servingSize;
    return (per100 * amount) / 100;
  }
  return null;
}

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

  // Optionnel: snapshots macros
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
    // g/ml
    if (
      food.fatPer100g != null ||
      food.carbsPer100g != null ||
      food.proteinPer100g != null
    ) {
      const factor = amount / 100;
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
