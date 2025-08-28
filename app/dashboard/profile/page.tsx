// app/dashboard/profile/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/profile/ProfileForm";
import type { ProfileFormState } from "./actions";
import * as actions from "./actions";

/**
 * Rétablit le pré-remplissage des champs profil :
 * - on charge l’utilisateur en BDD,
 * - on passe ses valeurs à ProfileForm via `defaults`.
 * On wrappe l’action existante sans changer son nom (on détecte automatiquement).
 */
function resolveAction() {
  const mod = actions as any;
  const fn =
    mod.saveProfileAction ??
    mod.updateProfileAction ??
    mod.saveProfile ??
    mod.default;
  if (typeof fn !== "function") {
    throw new Error(
      "Aucune Server Action exportée depuis app/dashboard/profile/actions."
    );
  }
  return fn as (
    prev: ProfileFormState,
    formData: FormData
  ) => Promise<ProfileFormState>;
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      age: true,
      weightKg: true,
      heightCm: true,
      sex: true,
      activityLevel: true,
      goal: true,
    },
  });

  // Bridge local — fiabilise l’annotation "use server"
  async function submit(prev: ProfileFormState, formData: FormData) {
    "use server";
    const impl = resolveAction();
    return impl(prev, formData);
  }

  const defaults = {
    age: user?.age ?? "",
    weightKg: user?.weightKg ?? "",
    heightCm: user?.heightCm ?? "",
    sex: (user?.sex ?? "") as any,
    activityLevel: (user?.activityLevel ?? "") as any,
    goal: (user?.goal ?? "") as any,
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Mon profil</h1>
      <ProfileForm onSubmit={submit} defaults={defaults} />
    </section>
  );
}
