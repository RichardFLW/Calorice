// components/profile/ProfileForm.tsx
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type {
  ProfileFormState,
  ProfileInput,
} from "@/app/dashboard/profile/actions";

type Props = {
  initialValues?: Partial<ProfileInput>;
  onSubmit: (
    state: ProfileFormState,
    formData: FormData
  ) => Promise<ProfileFormState>;
};

// ✅ Deux options seulement
const SEX_OPTIONS = [
  { value: "MALE", label: "Homme" },
  { value: "FEMALE", label: "Femme" },
] as const;

const ACTIVITY_OPTIONS = [
  { value: "SEDENTARY", label: "Sédentaire" },
  { value: "LIGHT", label: "Léger" },
  { value: "MODERATE", label: "Modéré" },
  { value: "ACTIVE", label: "Actif" },
  { value: "VERY_ACTIVE", label: "Très actif" },
] as const;

const GOAL_OPTIONS = [
  { value: "LOSE_WEIGHT", label: "Perte de poids" },
  { value: "MAINTAIN", label: "Maintien" },
  { value: "GAIN_WEIGHT", label: "Prise de poids" },
  { value: "RECOMP", label: "Recomposition" },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-50"
    >
      {pending ? "Enregistrement..." : "Enregistrer"}
    </button>
  );
}

export default function ProfileForm({ initialValues, onSubmit }: Props) {
  const [state, formAction] = useActionState(onSubmit, {});
  const err = (k: keyof ProfileInput) => state?.errors?.[k];

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      {/* Sexe */}
      <div>
        <label htmlFor="sex" className="block text-sm font-medium">
          Sexe biologique
        </label>
        <select
          id="sex"
          name="sex"
          defaultValue={initialValues?.sex ?? ""}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          required
        >
          <option value="" disabled>
            Sélectionner…
          </option>
          {SEX_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {err("sex") && (
          <p className="mt-1 text-sm text-red-600">{err("sex")}</p>
        )}
      </div>

      {/* Âge */}
      <div>
        <label htmlFor="age" className="block text-sm font-medium">
          Âge
        </label>
        <input
          id="age"
          name="age"
          type="number"
          inputMode="numeric"
          min={10}
          max={120}
          defaultValue={initialValues?.age ?? ""}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          required
        />
        {err("age") && (
          <p className="mt-1 text-sm text-red-600">{err("age")}</p>
        )}
      </div>

      {/* Poids */}
      <div>
        <label htmlFor="weightKg" className="block text-sm font-medium">
          Poids (kg)
        </label>
        <input
          id="weightKg"
          name="weightKg"
          type="number"
          inputMode="decimal"
          step="0.1"
          min={20}
          max={500}
          defaultValue={initialValues?.weightKg ?? ""}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          required
        />
        {err("weightKg") && (
          <p className="mt-1 text-sm text-red-600">{err("weightKg")}</p>
        )}
      </div>

      {/* Taille */}
      <div>
        <label htmlFor="heightCm" className="block text-sm font-medium">
          Taille (cm)
        </label>
        <input
          id="heightCm"
          name="heightCm"
          type="number"
          inputMode="numeric"
          min={50}
          max={260}
          defaultValue={initialValues?.heightCm ?? ""}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          required
        />
        {err("heightCm") && (
          <p className="mt-1 text-sm text-red-600">{err("heightCm")}</p>
        )}
      </div>

      {/* Activité */}
      <div>
        <label htmlFor="activityLevel" className="block text-sm font-medium">
          Niveau d’activité
        </label>
        <select
          id="activityLevel"
          name="activityLevel"
          defaultValue={initialValues?.activityLevel ?? ""}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          required
        >
          <option value="" disabled>
            Sélectionner…
          </option>
          {ACTIVITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {err("activityLevel") && (
          <p className="mt-1 text-sm text-red-600">{err("activityLevel")}</p>
        )}
      </div>

      {/* Objectif */}
      <div>
        <label htmlFor="goal" className="block text-sm font-medium">
          Objectif
        </label>
        <select
          id="goal"
          name="goal"
          defaultValue={initialValues?.goal ?? ""}
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
          required
        >
          <option value="" disabled>
            Sélectionner…
          </option>
          {GOAL_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {err("goal") && (
          <p className="mt-1 text-sm text-red-600">{err("goal")}</p>
        )}
      </div>

      {/* Messages globaux + bouton */}
      {state?.formError && (
        <p className="text-sm text-red-600">{state.formError}</p>
      )}
      {state?.ok && (
        <p className="text-sm text-green-600">Profil mis à jour ✅</p>
      )}

      <SubmitButton />
    </form>
  );
}
