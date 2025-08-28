// components/foods/FoodCreateForm.tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import type {
  FoodFormState,
  FoodInput,
} from "@/app/dashboard/foods/new/actions";

import MetaFields from "./create/MetaFields";
import ServingFields from "./create/ServingFields";
import CaloriesBlock from "./create/CaloriesBlock";
import MacrosBlock from "./create/MacrosBlock";

type Props = {
  onSubmit: (
    state: FoodFormState,
    formData: FormData
  ) => Promise<FoodFormState>;
};

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg_black px-4 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-50"
      style={{ backgroundColor: "black" }}
    >
      {pending ? "Enregistrement..." : "Créer l’aliment"}
    </button>
  );
}

export default function FoodCreateForm({ onSubmit }: Props) {
  const [state, formAction] = useActionState(onSubmit, {});
  const err = (k: keyof FoodInput) => state?.errors?.[k];

  // Pré-remplissage depuis ?q=… : digits 8–14 => barcode, sinon => name.
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();
  const qDigits = q.replace(/\s+/g, "");
  const isEAN = /^\d{8,14}$/.test(qDigits);
  const defaultName = !isEAN && q.length > 0 ? q : "";
  const defaultBarcode = isEAN ? qDigits : "";

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {/* Identité */}
      <MetaFields
        defaults={{ name: defaultName, barcode: defaultBarcode }}
        errors={{
          name: err("name"),
          brands: err("brands"),
          barcode: err("barcode"),
        }}
      />

      {/* Portion par défaut */}
      <ServingFields
        errors={{
          servingSize: err("servingSize"),
          servingUnit: err("servingUnit"),
        }}
      />

      {/* Calories */}
      <CaloriesBlock
        errors={{
          caloriesPer100g: err("caloriesPer100g"),
          caloriesPerPortion: err("caloriesPerPortion"),
        }}
      />

      {/* Macros */}
      <MacrosBlock
        errors={{
          fatPer100g: err("fatPer100g"),
          carbsPer100g: err("carbsPer100g"),
          proteinPer100g: err("proteinPer100g"),
          fatPerPortion: err("fatPerPortion"),
          carbsPerPortion: err("carbsPerPortion"),
          proteinPerPortion: err("proteinPerPortion"),
        }}
      />

      {/* Messages globaux + CTA */}
      {state?.formError && (
        <p className="text-sm text-red-600">{state.formError}</p>
      )}
      {state?.ok && (
        <p className="text-sm text-green-600">
          Aliment créé ✅ — tu peux le retrouver via la recherche du dashboard.
        </p>
      )}

      <SubmitBtn />
    </form>
  );
}
