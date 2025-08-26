// components/settings/DeleteAccountSection.tsx
"use client";

import { useTransition, useState } from "react";
import { deleteAccountAction } from "@/app/dashboard/settings/actions";

export default function DeleteAccountSection() {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <section className="border border-red-200 rounded-xl p-5 bg-red-50">
      <h2 className="text-lg font-semibold text-red-700">Zone dangereuse</h2>
      <p className="text-sm text-red-800 mt-2">
        Cette action supprime <strong>définitivement</strong> votre compte et
        toutes les données associées (connexions, préférences). <br />
        <strong>Les aliments créés sont conservés</strong> mais désolidarisés de
        votre profil.
      </p>

      <form
        className="mt-4 space-y-3"
        action={(formData) =>
          startTransition(async () => {
            const res = await deleteAccountAction(formData);
            setMessage(res.message);
            if (res.ok) {
              // En JWT, la session côté client disparaîtra après redirection (pas de session DB à purger)
              setTimeout(() => {
                window.location.href = "/";
              }, 800);
            }
          })
        }
      >
        <label className="block text-sm text-red-900">
          Tapez <span className="font-semibold">SUPPRIMER</span> pour confirmer
          :
        </label>
        <input
          type="text"
          name="confirm"
          placeholder="SUPPRIMER"
          className="w-full rounded-md border border-red-300 px-3 py-2 outline-none focus:ring-2 focus:ring-red-400 bg-white"
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? "Suppression…" : "Supprimer mon compte définitivement"}
        </button>

        {message && (
          <p
            className={`text-sm ${
              message.includes("supprimé") ? "text-green-700" : "text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
}
