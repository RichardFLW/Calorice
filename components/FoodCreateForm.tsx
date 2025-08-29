"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { foodSchema, FoodInput } from "@/lib/validations/food";
import { createFoodFromDashboardAction } from "@/app/dashboard/foods/new/actions";
import FoodIdentityFields from "./create/FoodIdentityFields";
import MacrosFields from "./create/MacroField";
import MacrosBlock from "./create/MacrosBlock";

export default function FoodCreateForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FoodInput>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: "",
      brand: "",
      barcode: "",
      caloriesPer100g: undefined,
      servingSize: undefined,
      servingUnit: "g",
      fatPer100g: undefined,
      saturatedPer100g: undefined,
      carbsPer100g: undefined,
      sugarPer100g: undefined,
      fiberPer100g: undefined,
      proteinPer100g: undefined,
    },
  });

  const onSubmit = async (data: FoodInput) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) formData.append(key, String(value));
    });
    await createFoodFromDashboardAction({}, formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Infos identité (nom, marque, code-barres) */}
      <FoodIdentityFields control={control} errors={errors} />

      {/* Macros par 100g */}
      <MacrosFields control={control} errors={errors} />

      {/* Macros par portion */}
      <MacrosBlock control={control} errors={errors} />

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Créer l’aliment
        </button>
      </div>
    </form>
  );
}
