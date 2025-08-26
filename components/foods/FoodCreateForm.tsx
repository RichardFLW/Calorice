// components/foods/FoodCreateForm.tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type {
  FoodFormState,
  FoodInput,
} from "@/app/dashboard/foods/new/actions";

type Props = {
  onSubmit: (
    state: FoodFormState,
    formData: FormData
  ) => Promise<FoodFormState>;
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-sm text-red-600">{msg}</p>;
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-50"
    >
      {pending ? "Enregistrement..." : "Créer l’aliment"}
    </button>
  );
}

export default function FoodCreateForm({ onSubmit }: Props) {
  const [state, formAction] = useActionState(onSubmit, {});

  const err = (k: keyof FoodInput) => state?.errors?.[k];

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {/* Identité */}
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
          />
          <FieldError msg={err("name")} />
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
          <FieldError msg={err("brands")} />
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
          />
          <FieldError msg={err("barcode")} />
        </div>
      </div>

      {/* Portion par défaut (facultative) */}
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
          <FieldError msg={err("servingSize")} />
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
          <FieldError msg={err("servingUnit")} />
        </div>
      </div>

      {/* Calories */}
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
            <FieldError msg={err("caloriesPer100g")} />
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
            <FieldError msg={err("caloriesPerPortion")} />
          </div>
        </div>
      </div>

      {/* Macros (facultatif) */}
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
            <FieldError msg={err("fatPer100g")} />
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
            <FieldError msg={err("carbsPer100g")} />
          </div>
          <div>
            <label
              htmlFor="proteinPer100g"
              className="block text-sm font-medium"
            >
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
            <FieldError msg={err("proteinPer100g")} />
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="fatPerPortion"
              className="block text-sm font-medium"
            >
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
            <FieldError msg={err("fatPerPortion")} />
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
            <FieldError msg={err("carbsPerPortion")} />
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
            <FieldError msg={err("proteinPerPortion")} />
          </div>
        </div>
      </div>

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
