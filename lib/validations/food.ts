import { z } from "zod";

// Validation pour la création d’un aliment
export const foodSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court."),
  brand: z.string().trim().optional().nullable(),
  barcode: z
    .string()
    .trim()
    .min(6, "Code-barres trop court.")
    .optional()
    .nullable(),
  caloriesPer100g: z
    .number({ invalid_type_error: "Doit être un nombre" })
    .nonnegative()
    .optional(),
  servingSize: z.number().positive().optional().nullable(),
  servingUnit: z.enum(["g", "ml", "portion"]).default("g"),

  fatPer100g: z.number().nonnegative().optional(),
  saturatedPer100g: z.number().nonnegative().optional(),
  carbsPer100g: z.number().nonnegative().optional(),
  sugarPer100g: z.number().nonnegative().optional(),
  fiberPer100g: z.number().nonnegative().optional(),
  proteinPer100g: z.number().nonnegative().optional(),

  // micronutriments (optionnel)
  micronutrientsPer100g: z.record(z.number()).optional(),
});

// Type TypeScript dérivé du schéma
export type FoodInput = z.infer<typeof foodSchema>;
