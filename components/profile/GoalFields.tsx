// components/profile/GoalFields.tsx
"use client";

import FormRow from "@/components/ui/FormRow";

type GoalErrors = Partial<Record<"goal", string>>;

type Props = {
  errors?: GoalErrors;
  defaults?: {
    goal?: "LOSE_WEIGHT" | "MAINTAIN" | "GAIN_WEIGHT" | "RECOMP" | "";
  };
};

/**
 * Objectif principal — utilisé par le calcul de la cible calorique.
 */
export default function GoalFields({ errors, defaults }: Props) {
  return (
    <div className="grid gap-4">
      <FormRow
        label="Objectif"
        htmlFor="goal"
        error={errors?.goal}
        help="Perdre, maintenir, prendre du poids, ou recomposition (perdre du gras et gagner du muscle lentement)."
      >
        <select
          id="goal"
          name="goal"
          defaultValue={defaults?.goal ?? ""}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">—</option>
          <option value="LOSE_WEIGHT">Perdre du poids</option>
          <option value="MAINTAIN">Maintenir</option>
          <option value="GAIN_WEIGHT">Prendre du poids</option>
          <option value="RECOMP">Recomposition</option>
        </select>
      </FormRow>
    </div>
  );
}
