// components/foods/search/SelectedFoodForm.tsx
"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import SubmitButton from "@/components/ui/SubmitButton";
import FormRow from "@/components/ui/FormRow";

type Result = {
  id: string;
  name: string;
  brand?: string | null;
};

type Props = {
  selected: Result;
  addAction: (formData: FormData) => Promise<any>; // server action
  defaultUnit?: "g" | "ml" | "portion";
  /** Appelé quand l’ajout est terminé (fermeture + refresh gérés au parent) */
  onAdded?: () => void;
};

/** Détecte la fin de soumission pour appeler onAdded. */
function ActionComplete({ onDone }: { onDone?: () => void }) {
  const { pending } = useFormStatus();
  const hadSubmit = useRef(false);

  useEffect(() => {
    if (pending) {
      hadSubmit.current = true;
    } else if (hadSubmit.current) {
      onDone?.(); // fin du cycle (succès attendu)
      hadSubmit.current = false;
    }
  }, [pending, onDone]);

  return null;
}

/**
 * Formulaire d’ajout au journal (envoie: foodId, amount, unit).
 */
export default function SelectedFoodForm({
  selected,
  addAction,
  defaultUnit = "g",
  onAdded,
}: Props) {
  return (
    <form action={addAction} className="space-y-3 rounded-md border p-4">
      <ActionComplete onDone={onAdded} />

      <div className="text-sm">
        <div className="font-medium">{selected.name}</div>
        {selected.brand && (
          <div className="text-gray-500">{selected.brand}</div>
        )}
      </div>

      <input type="hidden" name="foodId" value={selected.id} />

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <FormRow label="Quantité" htmlFor="amount">
          <input
            id="amount"
            name="amount"
            type="number"
            min={0}
            step="0.1"
            placeholder="Ex : 150"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            required
          />
        </FormRow>

        <FormRow label="Unité" htmlFor="unit">
          <select
            id="unit"
            name="unit"
            defaultValue={defaultUnit}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="g">g</option>
            <option value="ml">ml</option>
            <option value="portion">portion</option>
          </select>
        </FormRow>
      </div>

      <SubmitButton pendingText="Ajout…">Ajouter au journal</SubmitButton>
    </form>
  );
}
