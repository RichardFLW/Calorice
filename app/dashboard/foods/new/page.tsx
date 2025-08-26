// app/dashboard/foods/new/page.tsx
import { auth } from "@/auth";
import FoodCreateForm from "@/components/foods/FoodCreateForm";
import { createFoodAction } from "./actions";

export default async function NewFoodPage() {
  const session = await auth();
  if (!session) return null;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Ajouter un aliment</h1>
      <p className="text-gray-600 text-sm">
        Le <strong>code-barres</strong> et les <strong>calories</strong> par 100
        g ou par portion sont obligatoires. Le reste est facultatif.
      </p>

      <FoodCreateForm onSubmit={createFoodAction} />
    </section>
  );
}
