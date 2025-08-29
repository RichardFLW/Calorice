// components/foods/create/MetaFields.tsx
"use client";

import FieldErrorText from "./FieldErrorText";

type Props = {
  errors?: {
    name?: string;
    brands?: string;
    barcode?: string;
  };
  defaults?: {
    name?: string;
    barcode?: string;
  };
};

/** Bloc identité : nom, marques, code-barres (EAN). */
export default function MetaFields({ errors, defaults }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Nom de l’aliment (facultatif)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Ex: Fromage blanc nature 3,1%"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          defaultValue={defaults?.name ?? ""}
        />
        <FieldErrorText msg={errors?.name} />
      </div>

      <div>
        <label htmlFor="brands" className="block text-sm font-medium">
          Marques (séparées par des virgules)
        </label>
        <input
          id="brands"
          name="brands"
          type="text"
          placeholder="Leclerc, Marque Repère"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
        />
        <FieldErrorText msg={errors?.brands} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="barcode" className="block text-sm font-medium">
          Code-barres <span className="text-red-600">*</span>
        </label>
        <input
          id="barcode"
          name="barcode"
          type="text"
          inputMode="numeric"
          placeholder="Ex: 3564700012345"
          required
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          defaultValue={defaults?.barcode ?? ""}
        />
        <FieldErrorText msg={errors?.barcode} />
      </div>
    </div>
  );
}
