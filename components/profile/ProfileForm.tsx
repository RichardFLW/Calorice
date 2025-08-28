// components/profile/ProfileForm.tsx
"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/ui/SubmitButton";
import FieldError from "@/components/ui/FieldError";
import IdentityFields from "./IdentityFields";
import ActivityFields from "./ActivityFields";
import GoalFields from "./GoalFields";
import type {
  ProfileFormState,
  ProfileInput,
} from "@/app/dashboard/profile/actions";

/**
 * Formulaire profil — s'appuie sur 3 sous-composants.
 * Garde les `name` alignés avec Prisma et ta Server Action.
 */
type Props = {
  onSubmit: (
    state: ProfileFormState,
    formData: FormData
  ) => Promise<ProfileFormState>;
  defaults?: Partial<{
    age: number | "";
    weightKg: number | "";
    heightCm: number | "";
    sex: "MALE" | "FEMALE" | "OTHER" | "";
    activityLevel:
      | "SEDENTARY"
      | "LIGHT"
      | "MODERATE"
      | "ACTIVE"
      | "VERY_ACTIVE"
      | "";
    goal: "LOSE_WEIGHT" | "MAINTAIN" | "GAIN_WEIGHT" | "RECOMP" | "";
  }>;
};

export default function ProfileForm({ onSubmit, defaults }: Props) {
  const [state, formAction] = useActionState(onSubmit, {} as ProfileFormState);
  const err = (k: keyof ProfileInput) => state?.errors?.[k];

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      {/* Identité */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-700">Identité</h2>
        <IdentityFields
          defaults={{
            age: defaults?.age ?? "",
            weightKg: defaults?.weightKg ?? "",
            heightCm: defaults?.heightCm ?? "",
            sex: (defaults?.sex as any) ?? "",
          }}
          errors={{
            age: err("age"),
            weightKg: err("weightKg"),
            heightCm: err("heightCm"),
            sex: err("sex"),
          }}
        />
      </section>

      {/* Activité */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-700">Activité</h2>
        <ActivityFields
          defaults={{ activityLevel: (defaults?.activityLevel as any) ?? "" }}
          errors={{ activityLevel: err("activityLevel") }}
        />
      </section>

      {/* Objectif */}
      <section>
        <h2 className="mb-3 text-sm font-medium text-gray-700">Objectif</h2>
        <GoalFields
          defaults={{ goal: (defaults?.goal as any) ?? "" }}
          errors={{ goal: err("goal") }}
        />
      </section>

      {/* Messages globaux */}
      {state?.formError && <FieldError message={state.formError} />}
      {state?.ok && (
        <p className="text-sm text-green-600">
          Profil enregistré ✅ — le calcul de l’objectif est à jour.
        </p>
      )}

      <SubmitButton pendingText="Sauvegarde…">
        Enregistrer le profil
      </SubmitButton>
    </form>
  );
}
