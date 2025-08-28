// components/profile/ActivityFields.tsx
"use client";

import FormRow from "@/components/ui/FormRow";

type ActivityErrors = Partial<Record<"activityLevel", string>>;

type Props = {
  errors?: ActivityErrors;
  defaults?: {
    activityLevel?:
      | "SEDENTARY"
      | "LIGHT"
      | "MODERATE"
      | "ACTIVE"
      | "VERY_ACTIVE"
      | "";
  };
};

/**
 * Niveau d'activité (PAL). Les libellés FR masquent les valeurs enum Prisma.
 */
export default function ActivityFields({ errors, defaults }: Props) {
  return (
    <div className="grid gap-4">
      <FormRow
        label="Niveau d’activité"
        htmlFor="activityLevel"
        error={errors?.activityLevel}
        help="Sédentaire : bureau / peu de marche. Actif : métier physique ou sport régulier."
      >
        <select
          id="activityLevel"
          name="activityLevel"
          defaultValue={defaults?.activityLevel ?? ""}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">—</option>
          <option value="SEDENTARY">Sédentaire</option>
          <option value="LIGHT">Léger</option>
          <option value="MODERATE">Modéré</option>
          <option value="ACTIVE">Actif</option>
          <option value="VERY_ACTIVE">Très actif</option>
        </select>
      </FormRow>
    </div>
  );
}
