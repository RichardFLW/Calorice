// components/foods/create/MacrosFields.tsx
"use client";

import FormRow from "@/components/ui/FormRow";

export type MacrosValues = {
  fat: number | "";
  saturated?: number | "";
  carbs: number | "";
  sugar?: number | "";
  fiber?: number | "";
  protein: number | "";
  salt?: number | "";
};

type Props = {
  values: MacrosValues;
  onChange: (patch: Partial<MacrosValues>) => void;
  errors?: Partial<Record<keyof MacrosValues, string>>;
};

/**
 * Bloc "macros" (pour 100g/100ml).
 * Sature les champs obligatoires en premier (lipides/glucides/protéines).
 */
export default function MacrosFields({ values, onChange, errors }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <FormRow label="Lipides (g)" htmlFor="fat" required error={errors?.fat}>
        <input
          id="fat"
          type="number"
          min={0}
          step="any"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={values.fat === undefined ? "" : values.fat}
          onChange={(e) =>
            onChange({
              fat: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="Ex : 3.6"
        />
      </FormRow>

      <FormRow
        label="Acides gras saturés (g)"
        htmlFor="saturated"
        error={errors?.saturated}
      >
        <input
          id="saturated"
          type="number"
          min={0}
          step="any"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={values.saturated === undefined ? "" : values.saturated}
          onChange={(e) =>
            onChange({
              saturated: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="Ex : 1.0"
        />
      </FormRow>

      <FormRow
        label="Glucides (g)"
        htmlFor="carbs"
        required
        error={errors?.carbs}
      >
        <input
          id="carbs"
          type="number"
          min={0}
          step="any"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={values.carbs === undefined ? "" : values.carbs}
          onChange={(e) =>
            onChange({
              carbs: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="Ex : 4.0"
        />
      </FormRow>

      <FormRow label="Sucres (g)" htmlFor="sugar" error={errors?.sugar}>
        <input
          id="sugar"
          type="number"
          min={0}
          step="any"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={values.sugar === undefined ? "" : values.sugar}
          onChange={(e) =>
            onChange({
              sugar: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="Ex : 4.0"
        />
      </FormRow>

      <FormRow label="Fibres (g)" htmlFor="fiber" error={errors?.fiber}>
        <input
          id="fiber"
          type="number"
          min={0}
          step="any"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={values.fiber === undefined ? "" : values.fiber}
          onChange={(e) =>
            onChange({
              fiber: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="Ex : 0.0"
        />
      </FormRow>

      <FormRow
        label="Protéines (g)"
        htmlFor="protein"
        required
        error={errors?.protein}
      >
        <input
          id="protein"
          type="number"
          min={0}
          step="any"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={values.protein === undefined ? "" : values.protein}
          onChange={(e) =>
            onChange({
              protein: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="Ex : 8.0"
        />
      </FormRow>

      <FormRow label="Sel (g)" htmlFor="salt" error={errors?.salt}>
        <input
          id="salt"
          type="number"
          min={0}
          step="any"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          value={values.salt === undefined ? "" : values.salt}
          onChange={(e) =>
            onChange({
              salt: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          placeholder="Ex : 0.10"
        />
      </FormRow>
    </div>
  );
}
