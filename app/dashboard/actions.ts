// app/dashboard/actions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ActionState = { ok?: boolean; error?: string };

// ---------- AJOUT D’ENTRÉE ----------
const addSchema = z.object({
  foodId: z.string().min(1).optional(),
  amount: z.coerce.number().optional(),
  unit: z.string().optional(),
  calories: z.coerce.number().optional(),
  eatenAt: z.coerce.date().optional(),
});

async function addCore(formData: FormData): Promise<ActionState> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { error: "Non authentifié." };

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) return { error: "Utilisateur introuvable." };

  const raw = Object.fromEntries(formData.entries());
  const parsed = addSchema.safeParse({
    foodId: (raw.foodId || raw.id) as string | undefined,
    amount: raw.amount as string | undefined,
    unit: raw.unit as string | undefined,
    calories: raw.calories as string | undefined,
    eatenAt: raw.eatenAt as string | undefined,
  });
  if (!parsed.success)
    return { error: parsed.error.errors[0]?.message ?? "Formulaire invalide." };

  const { foodId, amount, unit, eatenAt } = parsed.data;
  let calories = parsed.data.calories;

  if (calories == null && foodId) {
    const food = await prisma.food.findUnique({
      where: { id: foodId },
      select: { caloriesPer100g: true, caloriesPerPortion: true },
    });
    if (food && amount && unit) {
      if ((unit === "g" || unit === "ml") && food.caloriesPer100g != null) {
        calories = (food.caloriesPer100g * amount) / 100;
      } else if (unit === "portion" && food.caloriesPerPortion != null) {
        calories = food.caloriesPerPortion * amount;
      }
    }
  }

  await prisma.mealEntry.create({
    data: {
      userId: user.id,
      foodId: foodId ?? null,
      eatenAt: eatenAt ?? new Date(),
      amount: amount ?? null,
      unit: unit ?? null,
      calories: calories ?? 0,
    },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}

// Signature standard (1 argument)
export async function addMealEntryAction(
  formData: FormData
): Promise<ActionState> {
  return addCore(formData);
}

// Compat ancienne (2 arguments) si des formulaires historique l’utilisent encore
export async function addMealEntryActionV1(
  _prev: ActionState | undefined,
  formData: FormData
) {
  return addCore(formData);
}

// ---------- SUPPRESSION D’ENTRÉE ----------
const removeSchema = z.object({ id: z.string().min(1) });

async function removeCore(formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Non authentifié." };

  const raw = Object.fromEntries(formData.entries());
  const parsed = removeSchema.safeParse({ id: raw.id as string | undefined });
  if (!parsed.success) return { error: "ID manquant." };

  await prisma.mealEntry.delete({ where: { id: parsed.data.id } });
  revalidatePath("/dashboard");
  return { ok: true };
}

// Signature standard (1 argument)
export async function removeEntryAction(
  formData: FormData
): Promise<ActionState> {
  return removeCore(formData);
}

// Compat ancienne (2 arguments)
export async function removeEntryActionV1(
  _prev: ActionState | undefined,
  formData: FormData
) {
  return removeCore(formData);
}
