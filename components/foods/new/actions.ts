// app/dashboard/foods/new/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type FoodFormState = {
  ok?: boolean;
  id?: string;
  formError?: string;
  errors?: Partial<Record<keyof FoodInput, string>>;
};

const str = z
  .string()
  .transform((s) => s.trim())
  .pipe(z.string().optional());

const numOpt = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "string" ? v.trim() : v))
  .transform((v) => (v === "" ? undefined : v))
  .optional()
  .refine((v) => v == null || !Number.isNaN(Number(v)), {
    message: "Nombre invalide.",
  })
  .transform((v) => (v == null ? undefined : Number(v)));

const schema = z
  .object({
    name: str,
    brands: str,
    barcode: z
      .string()
      .transform((s) => s.trim())
      .min(6, "Code-barres trop court."),
    servingSize: numOpt, // ex: 30 (facultatif)
    servingUnit: z
      .string()
      .transform((s) => s.trim())
      .optional()
      .refine((v) => !v || ["g", "ml", "portion", "piece"].includes(v), {
        message: "Unité invalide.",
      }),

    caloriesPer100g: numOpt,
    caloriesPerPortion: numOpt,

    fatPer100g: numOpt,
    carbsPer100g: numOpt,
    proteinPer100g: numOpt,

    fatPerPortion: numOpt,
    carbsPerPortion: numOpt,
    proteinPerPortion: numOpt,
  })
  .superRefine((data, ctx) => {
    // Au moins l’un des deux doit être présent
    if (data.caloriesPer100g == null && data.caloriesPerPortion == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["caloriesPer100g"],
        message: "Renseigne les calories /100g ou par portion.",
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["caloriesPerPortion"],
        message: "Renseigne les calories /100g ou par portion.",
      });
    }
  });

export type FoodInput = z.infer<typeof schema>;

export async function createFoodAction(
  _prev: FoodFormState,
  formData: FormData
): Promise<FoodFormState> {
  try {
    const session = await auth();
    if (!session?.user?.email) return { formError: "Non connecté." };

    const parsed = schema.safeParse({
      name: formData.get("name"),
      brands: formData.get("brands"),
      barcode: String(formData.get("barcode") ?? ""),
      servingSize: formData.get("servingSize"),
      servingUnit: formData.get("servingUnit"),

      caloriesPer100g: formData.get("caloriesPer100g"),
      caloriesPerPortion: formData.get("caloriesPerPortion"),

      fatPer100g: formData.get("fatPer100g"),
      carbsPer100g: formData.get("carbsPer100g"),
      proteinPer100g: formData.get("proteinPer100g"),

      fatPerPortion: formData.get("fatPerPortion"),
      carbsPerPortion: formData.get("carbsPerPortion"),
      proteinPerPortion: formData.get("proteinPerPortion"),
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = issue.message;
      }
      return { errors };
    }

    const data = parsed.data;

    // Création
    const created = await prisma.food.create({
      data: {
        name: data.name || "Sans nom",
        brands: data.brands || null,
        barcode: data.barcode,
        servingSize: data.servingSize ?? null,
        servingUnit: data.servingUnit || null,

        caloriesPer100g: data.caloriesPer100g ?? null,
        caloriesPerPortion: data.caloriesPerPortion ?? null,

        fatPer100g: data.fatPer100g ?? null,
        carbsPer100g: data.carbsPer100g ?? null,
        proteinPer100g: data.proteinPer100g ?? null,

        fatPerPortion: data.fatPerPortion ?? null,
        carbsPerPortion: data.carbsPerPortion ?? null,
        proteinPerPortion: data.proteinPerPortion ?? null,
      },
      select: { id: true },
    });

    // Pour que la recherche voie l’élément immédiatement
    revalidatePath("/dashboard");
    revalidatePath("/api/foods/search");

    return { ok: true, id: created.id };
  } catch (e: any) {
    // Doublon code-barres
    if (
      e?.code === "P2002" &&
      Array.isArray(e?.meta?.target) &&
      e.meta.target.includes("barcode")
    ) {
      return { errors: { barcode: "Ce code-barres existe déjà." } };
    }
    return { formError: e?.message ?? "Erreur serveur." };
  }
}
