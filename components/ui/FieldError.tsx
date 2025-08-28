// components/ui/FieldError.tsx
"use client";

import { memo } from "react";

/**
 * Affiche un message d'erreur de champ, avec une marge compacte.
 * Garde le DOM minimal si aucun message.
 */
function FieldErrorBase({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export default memo(FieldErrorBase);
