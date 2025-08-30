// app/dashboard/foods/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z.string().min(1),
  brands: z.string().optional(),
  barcode: z.string().optional(),
  servingSize: z.coerce.number().positive().optional(),
  servingUnit: z.enum(["g", "ml", "portion"]).optional(),
  caloriesPer100g: z.coerce.number().nonnegative().optional(),
  caloriesPerPortion: z.coerce.number().nonnegative().optional(),
  fatPer100g: z.coerce.number().nonnegative().optional(),
  carbsPer100g: z.coerce.number().nonnegative().optional(),
  proteinPer100g: z.coerce.number().nonnegative().optional(),
  fatPerPortion: z.coerce.number().nonnegative().optional(),
  carbsPerPortion: z.coerce.number().nonnegative().optional(),
  proteinPerPortion: z.coerce.number().nonnegative().optional(),
});

type ActionState =
  | { ok: true; food: { id: string; name: string | null } }
  | { ok: false; error: string };

export async function createFoodAction(
  formData: FormData
): Promise<ActionState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.errors[0]?.message ?? "Formulaire invalide.",
    };
  }
  const v = parsed.data;

  try {
    const food = await prisma.food.create({
      data: {
        name: v.name,
        brands: emptyToNull(v.brands),
        barcode: emptyToNull(v.barcode),
        servingSize: v.servingSize ?? null,
        servingUnit: v.servingUnit ?? null,
        caloriesPer100g: v.caloriesPer100g ?? null,
        caloriesPerPortion: v.caloriesPerPortion ?? null,
        fatPer100g: v.fatPer100g ?? null,
        carbsPer100g: v.carbsPer100g ?? null,
        proteinPer100g: v.proteinPer100g ?? null,
        fatPerPortion: v.fatPerPortion ?? null,
        carbsPerPortion: v.carbsPerPortion ?? null,
        proteinPerPortion: v.proteinPerPortion ?? null,
      },
      select: { id: true, name: true },
    });

    // rafraîchir le dashboard / recherche
    revalidatePath("/dashboard");
    return { ok: true, food };
  } catch (e: unknown) {
    // message plus clair sur l’unicité du code-barres
    const msg =
      e instanceof Error && e.message.includes("`barcode`")
        ? "Ce code-barres existe déjà."
        : "Impossible de créer cet aliment.";
    return { ok: false, error: msg };
  }
}

function emptyToNull(v?: string) {
  return v && v.trim() ? v : null;
}
