// components/dashboard/DashboardShell.tsx
"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_1fr]">
      {/* Sidebar desktop */}
      <aside className="hidden border-r lg:block">
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>

      {/* Colonne contenu (header + main) */}
      <div className="flex min-h-dvh flex-col">
        {/* Header desktop */}
        <header className="hidden items-center justify-between border-b p-3 lg:flex">
          <div className="font-medium">Dashboard</div>
          <button
            onClick={handleSignOut}
            className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-900"
          >
            Se déconnecter
          </button>
        </header>

        {/* Header mobile */}
        <header className="flex items-center justify-between border-b p-3 lg:hidden">
          <button
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            ☰ Menu
          </button>
          <div className="font-medium">Dashboard</div>
          <button
            onClick={handleSignOut}
            className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-gray-900"
          >
            Déconnexion
          </button>
        </header>

        {/* Drawer mobile */}
        {open && (
          <div className="lg:hidden">
            <div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <aside className="fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] border-r bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-semibold">Navigation</div>
                <button
                  aria-label="Fermer"
                  onClick={() => setOpen(false)}
                  className="rounded-md border px-2 py-1 text-sm"
                >
                  ✕
                </button>
              </div>
              <Sidebar onNavigate={() => setOpen(false)} />
            </aside>
          </div>
        )}

        {/* Contenu */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
