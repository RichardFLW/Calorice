// components/ui/SubmitButton.tsx
"use client";

import { useFormStatus } from "react-dom";

type Props = {
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
};

/**
 * Bouton submit compatible Server Actions (useFormStatus).
 * Désactivé + texte alternatif pendant l'envoi.
 */
export default function SubmitButton({
  children,
  className,
  pendingText = "Envoi…",
}: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition",
        pending
          ? "cursor-not-allowed opacity-60"
          : "hover:bg-gray-50 active:translate-y-px",
        className ?? "border-gray-300 bg-white text-gray-900",
      ].join(" ")}
      aria-busy={pending}
    >
      {pending ? pendingText : children}
    </button>
  );
}
