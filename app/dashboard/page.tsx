// app/dashboard/page.tsx
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) return null;

  return (
    <section className="space-y-2">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Bienvenue {session.user?.name ?? session.user?.email}</p>
    </section>
  );
}
