// app/dashboard/page.tsx
import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  // Ici, par sécurité côté page (double filet)
  if (!session) return null;

  return (
    <main className="p-10 space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Bienvenue {session.user?.name ?? session.user?.email}</p>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="mt-4 rounded-md bg-black px-4 py-2 text-white">
          Se déconnecter
        </button>
      </form>
    </main>
  );
}
