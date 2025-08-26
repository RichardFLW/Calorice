// app/dashboard/settings/page.tsx
import DeleteAccountSection from "@/components/settings/DeleteAccountSection";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Paramètres</h1>

      {/* …autres sections paramètres… */}

      <DeleteAccountSection />
    </div>
  );
}
