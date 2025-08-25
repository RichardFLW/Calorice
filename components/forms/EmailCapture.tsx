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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);

    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Email invalide.");
      return;
    }

    try {
      setLoading(true);
      const res = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      if (res?.error) {
        setError(res.error);
        setOk(false);
      } else {
        setOk(true);
      }
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  const describedBy = error ? "email-error" : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      <label htmlFor="email" className="block text-sm font-medium">
        Connexion par email
      </label>
      <div className="flex gap-2">
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="ton@email.fr"
          className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Recevoir le lien"}
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
