// components/forms/EmailCapture.tsx
"use client";

import { useState } from "react";
import { z } from "zod";
import { signIn } from "next-auth/react";

const schema = z.object({
  email: z
    .string()
    .min(1, "L’email est requis.")
    .email("Adresse email invalide."),
});

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk(false);
    setError(null);

    const result = schema.safeParse({ email });
    if (!result.success) {
      const { fieldErrors } = result.error.flatten();
      setError(fieldErrors.email?.[0] ?? "Erreur.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Envoie l'email magique sans changer de page
      await signIn("resend", {
        email,
        redirect: false, // <- pas de navigation vers /verify-request
        callbackUrl: "/dashboard", // <- but après connexion
        redirectTo: "/dashboard", // <- compat (si jamais)
      });

      setOk(true);
      setEmail("");
    } catch {
      setError("L’envoi a échoué. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-2">
      <div className="flex items-start gap-2">
        <input
          type="email"
          name="email"
          placeholder="Entrez votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex-1 rounded-md border px-3 py-2 outline-none transition
            ${
              error ? "border-red-500" : "border-gray-300 focus:border-gray-400"
            }
          `}
          aria-invalid={!!error}
          aria-describedby="email-error"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md px-4 py-2 bg-black text-white disabled:opacity-60"
        >
          {loading ? "..." : "Valider"}
        </button>
      </div>

      {error && (
        <p id="email-error" className="text-sm text-red-600">
          {error}
        </p>
      )}

      {ok && !error && (
        <p className="text-sm text-green-600">
          Email envoyé ✅. Ouvre le lien pour accéder au Dashboard.
        </p>
      )}
    </form>
  );
}
