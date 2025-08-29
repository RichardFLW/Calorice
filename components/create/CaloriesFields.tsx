// components/foods/create/CaloriesFields.tsx
"use client";

import FormRow from "@/components/ui/FormRow";

export type CaloriesValues = {
  calories: number | ""; // pour 100g / 100ml
};

type Props = {
  values: CaloriesValues;
  onChange: (patch: Partial<CaloriesValues>) => void;
  errors?: Partial<Record<keyof CaloriesValues, string>>;
};

/**
 * Bloc "calories" (pour 100g/100ml).
 * L’échelle exacte (100g/100ml) est à préciser dans le parent si nécessaire.
 */
export default function CaloriesFields({ values, onChange, errors }: Props) {
  return (
    <FormRow
      label="Calories (pour 100g / 100ml)"
      htmlFor="calories"
      required
      error={errors?.calories}
    >
      <input
        id="calories"
        type="number"
        min={0}
        step="any"
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        value={values.calories === undefined ? "" : values.calories}
        onChange={(e) =>
          onChange({
            calories: e.target.value === "" ? "" : Number(e.target.value),
          })
        }
        placeholder="Ex : 69"
      />
    </FormRow>
  );
}
