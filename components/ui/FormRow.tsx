// components/ui/FormRow.tsx
"use client";

import { ReactNode } from "react";
import FieldError from "./FieldError";

type Props = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  help?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Ligne de formulaire standardisée : label + contrôle + aide + erreur.
 * Laisse la responsabilité du "register" ou des handlers au parent.
 */
export default function FormRow({
  label,
  htmlFor,
  required,
  help,
  error,
  children,
  className,
}: Props) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-sm font-medium text-gray-800"
      >
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      {children}

      {help && <p className="mt-1 text-xs text-gray-500">{help}</p>}
      <FieldError message={error} />
    </div>
  );
}
