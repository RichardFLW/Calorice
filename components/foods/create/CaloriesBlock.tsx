// components/foods/create/CaloriesBlock.tsx
"use client";

import FieldErrorText from "./FieldErrorText";

type Props = {
  errors?: {
    caloriesPer100g?: string;
    caloriesPerPortion?: string;
  };
};

/** Bloc calories — mêmes noms/id qu’avant. */
export default function CaloriesBlock({ errors }: Props) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 font-medium">
        Calories <span className="text-red-600">*</span>
      </div>
      <p className="text-xs text-gray-500">
        Renseigne au moins l’un des champs : <strong>par 100 g</strong> ou{" "}
        <strong>par portion</strong>.
      </p>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="caloriesPer100g"
            className="block text-sm font-medium"
          >
            kcal / 100 g
          </label>
          <input
            id="caloriesPer100g"
            name="caloriesPer100g"
            type="number"
            min={0}
            step="0.1"
            placeholder="Ex: 69"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          <FieldErrorText msg={errors?.caloriesPer100g} />
        </div>

        <div>
          <label
            htmlFor="caloriesPerPortion"
            className="block text-sm font-medium"
          >
            kcal / portion
          </label>
          <input
            id="caloriesPerPortion"
            name="caloriesPerPortion"
            type="number"
            min={0}
            step="0.1"
            placeholder="Ex: 120"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          <FieldErrorText msg={errors?.caloriesPerPortion} />
        </div>
      </div>
    </div>
  );
}
