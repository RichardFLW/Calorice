// components/profile/IdentityFields.tsx
"use client";

import FormRow from "@/components/ui/FormRow";

type IdentityErrors = Partial<
  Record<"age" | "weightKg" | "heightCm" | "sex", string>
>;

type Props = {
  errors?: IdentityErrors;
  defaults?: {
    age?: number | "";
    weightKg?: number | "";
    heightCm?: number | "";
    sex?: "MALE" | "FEMALE" | "OTHER" | "";
  };
};

/**
 * Identité physique : âge, poids, taille, sexe.
 * Laisse la validation à la Server Action (Zod côté serveur).
 */
export default function IdentityFields({ errors, defaults }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormRow label="Âge" htmlFor="age" error={errors?.age}>
        <input
          id="age"
          name="age"
          type="number"
          min={0}
          step={1}
          defaultValue={defaults?.age ?? ""}
          placeholder="Ex : 32"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
      </FormRow>

      <FormRow label="Sexe" htmlFor="sex" error={errors?.sex}>
        <select
          id="sex"
          name="sex"
          defaultValue={defaults?.sex ?? ""}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">—</option>
          <option value="MALE">Homme</option>
          <option value="FEMALE">Femme</option>
          <option value="OTHER">Autre / préfère ne pas dire</option>
        </select>
      </FormRow>

      <FormRow label="Poids (kg)" htmlFor="weightKg" error={errors?.weightKg}>
        <input
          id="weightKg"
          name="weightKg"
          type="number"
          min={0}
          step="0.1"
          defaultValue={defaults?.weightKg ?? ""}
          placeholder="Ex : 73.5"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
      </FormRow>

      <FormRow label="Taille (cm)" htmlFor="heightCm" error={errors?.heightCm}>
        <input
          id="heightCm"
          name="heightCm"
          type="number"
          min={0}
          step={1}
          defaultValue={defaults?.heightCm ?? ""}
          placeholder="Ex : 178"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
      </FormRow>
    </div>
  );
}
