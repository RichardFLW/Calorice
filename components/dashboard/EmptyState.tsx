"use client";

import { useRouter } from "next/navigation";

export default function EmptyState() {
  const router = useRouter();

  return (
    <div className="text-center p-6 border rounded bg-gray-50">
      <p className="mb-4 text-gray-600">Aucun résultat pour cette recherche.</p>
      <button
        onClick={() => router.push("/dashboard/foods/new")}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Ajouter un aliment
      </button>
    </div>
  );
}
