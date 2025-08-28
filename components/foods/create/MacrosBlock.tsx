// components/foods/create/MacrosBlock.tsx
"use client";

import FieldErrorText from "./FieldErrorText";

type Props = {
  errors?: {
    fatPer100g?: string;
    carbsPer100g?: string;
    proteinPer100g?: string;
    fatPerPortion?: string;
    carbsPerPortion?: string;
    proteinPerPortion?: string;
  };
};

/** Bloc macros (facultatif) — mêmes champs exactement. */
export default function MacrosBlock({ errors }: Props) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 font-medium">Macros (facultatif)</div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="fatPer100g" className="block text-sm font-medium">
            Lipides / 100 g (g)
          </label>
          <input
            id="fatPer100g"
            name="fatPer100g"
            type="number"
            min={0}
            step="0.1"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          <FieldErrorText msg={errors?.fatPer100g} />
        </div>

        <div>
          <label htmlFor="carbsPer100g" className="block text-sm font-medium">
            Glucides / 100 g (g)
          </label>
          <input
            id="carbsPer100g"
            name="carbsPer100g"
            type="number"
            min={0}
            step="0.1"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          <FieldErrorText msg={errors?.carbsPer100g} />
        </div>

        <div>
          <label htmlFor="proteinPer100g" className="block text-sm font-medium">
            Protéines / 100 g (g)
          </label>
          <input
            id="proteinPer100g"
            name="proteinPer100g"
            type="number"
            min={0}
            step="0.1"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          <FieldErrorText msg={errors?.proteinPer100g} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="fatPerPortion" className="block text-sm font-medium">
            Lipides / portion (g)
          </label>
          <input
            id="fatPerPortion"
            name="fatPerPortion"
            type="number"
            min={0}
            step="0.1"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          <FieldErrorText msg={errors?.fatPerPortion} />
        </div>

        <div>
          <label
            htmlFor="carbsPerPortion"
            className="block text-sm font-medium"
          >
            Glucides / portion (g)
          </label>
          <input
            id="carbsPerPortion"
            name="carbsPerPortion"
            type="number"
            min={0}
            step="0.1"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          <FieldErrorText msg={errors?.carbsPerPortion} />
        </div>

        <div>
          <label
            htmlFor="proteinPerPortion"
            className="block text-sm font-medium"
          >
            Protéines / portion (g)
          </label>
          <input
            id="proteinPerPortion"
            name="proteinPerPortion"
            type="number"
            min={0}
            step="0.1"
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          />
          <FieldErrorText msg={errors?.proteinPerPortion} />
        </div>
      </div>
    </div>
  );
}
