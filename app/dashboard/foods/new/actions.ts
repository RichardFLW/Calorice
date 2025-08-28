"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { foodSchema, FoodInput } from "@/lib/validations/food";

export type CreateFoodState = {
  ok?: boolean;
  error?: string;
};

export async function createFoodFromDashboardAction(
  _prev: CreateFoodState,
  formData: FormData
): Promise<CreateFoodState> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Non connecté." };

  try {
    // Transformer FormData → objet brut
    const raw: Record<string, any> = {};
    formData.forEach((value, key) => {
      raw[key] = value;
    });

    // Validation avec Zod
    const parsed: FoodInput = foodSchema.parse({
      name: raw.name,
      brand: raw.brand,
      barcode: raw.barcode,
      caloriesPer100g: raw.caloriesPer100g
        ? Number(raw.caloriesPer100g)
        : undefined,
      servingSize: raw.servingSize ? Number(raw.servingSize) : undefined,
      servingUnit: raw.servingUnit,
      fatPer100g: raw.fatPer100g ? Number(raw.fatPer100g) : undefined,
      saturatedPer100g: raw.saturatedPer100g
        ? Number(raw.saturatedPer100g)
        : undefined,
      carbsPer100g: raw.carbsPer100g ? Number(raw.carbsPer100g) : undefined,
      sugarPer100g: raw.sugarPer100g ? Number(raw.sugarPer100g) : undefined,
      fiberPer100g: raw.fiberPer100g ? Number(raw.fiberPer100g) : undefined,
      proteinPer100g: raw.proteinPer100g
        ? Number(raw.proteinPer100g)
        : undefined,
    });

    // Trouver l’utilisateur connecté
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) return { error: "Utilisateur introuvable." };

    // Création en base
    await prisma.food.create({
      data: {
        userId: user.id,
        ...parsed,
      },
    });

    // Rafraîchir la page dashboard
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (err: any) {
    if (err.name === "ZodError") {
      return { error: err.errors?.[0]?.message ?? "Erreur de validation." };
    }
    return { error: "Erreur lors de la création de l’aliment." };
  }
}
