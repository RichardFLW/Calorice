// components/foods/create/FieldErrorText.tsx
"use client";

export default function FieldErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-sm text-red-600">{msg}</p>;
}
