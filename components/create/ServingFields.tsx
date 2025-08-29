// components/foods/create/ServingFields.tsx
"use client";

import FieldErrorText from "./FieldErrorText";

type Props = {
  errors?: {
    servingSize?: string;
    servingUnit?: string;
  };
};

/** Bloc portion par défaut (facultatif). */
export default function ServingFields({ errors }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
      <div>
        <label htmlFor="servingSize" className="block text-sm font-medium">
          Taille de portion par défaut (facultatif)
        </label>
        <input
          id="servingSize"
          name="servingSize"
          type="number"
          min={0}
          step="0.1"
          placeholder="Ex: 30"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
        <FieldErrorText msg={errors?.servingSize} />
      </div>

      <div>
        <label htmlFor="servingUnit" className="block text-sm font-medium">
          Unité
        </label>
        <select
          id="servingUnit"
          name="servingUnit"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          defaultValue="g"
        >
          <option value="g">g</option>
          <option value="ml">ml</option>
          <option value="portion">portion</option>
          <option value="piece">pièce</option>
        </select>
        <FieldErrorText msg={errors?.servingUnit} />
      </div>
    </div>
  );
}
