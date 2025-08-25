// app/page.tsx
import Link from "next/link";
import { auth } from "@/auth";
import EmailCapture from "@/components/forms/EmailCapture";

export default async function Page() {
  const session = await auth();

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-semibold">Accueil</h1>

        <EmailCapture />

        {session && (
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:bg-gray-900"
            >
              Accéder au Dashboard
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
