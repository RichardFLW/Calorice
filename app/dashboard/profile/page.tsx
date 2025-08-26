// app/dashboard/profile/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/profile/ProfileForm";
import { updateProfileAction } from "./actions";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.email) return null;

  // ⚠️ Certains environnements gardent un client Prisma pas régénéré.
  // On évite l’erreur TS en lisant l’objet complet puis en mappant
  // les champs attendus par le formulaire.
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const initialValues = user
    ? {
        sex: (user as any)?.sex ?? undefined,
        age: (user as any)?.age ?? undefined,
        weightKg: (user as any)?.weightKg ?? undefined,
        heightCm: (user as any)?.heightCm ?? undefined,
        activityLevel: (user as any)?.activityLevel ?? undefined,
        goal: (user as any)?.goal ?? undefined,
      }
    : {};

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <p className="text-gray-600 text-sm">
        Renseigne tes informations pour personnaliser tes recommandations.
      </p>

      <ProfileForm
        initialValues={initialValues}
        onSubmit={updateProfileAction}
      />
    </section>
  );
}
