// components/foods/search/SearchInput.tsx
"use client";

import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

/**
 * Champ de recherche avec debounce 250ms.
 * - `value` contrôlé par le parent ; `draft` local pour la frappe.
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = "Rechercher un aliment…",
  autoFocus,
}: Props) {
  const [draft, setDraft] = useState(value);

  // Sync si le parent change (clear après ajout, par ex.)
  useEffect(() => setDraft(value), [value]);

  // Debounce vers le parent
  useEffect(() => {
    const id = setTimeout(() => {
      if (draft !== value) onChange(draft);
    }, 250);
    return () => clearTimeout(id);
  }, [draft, value, onChange]);

  return (
    <input
      type="search"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
      autoFocus={autoFocus}
      aria-label="Recherche d'aliment"
    />
  );
}
