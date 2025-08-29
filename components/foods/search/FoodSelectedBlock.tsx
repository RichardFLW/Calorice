"use client";

import SelectedFoodForm from "./SelectedFoodForm";

type Result = {
  id: string;
  name: string;
  brand?: string | null;
  caloriesPer100g?: number | null;
};

type Props = {
  selected: Result;
  addAction: (formData: FormData) => Promise<any>;
  onReset: () => void;
};

export default function FoodSelectedBlock({
  selected,
  addAction,
  onReset,
}: Props) {
  return (
    <div className="space-y-3">
      <SelectedFoodForm
        selected={selected}
        addAction={addAction}
        onAdded={onReset}
      />
      <button
        type="button"
        className="text-xs text-gray-500 underline"
        onClick={onReset}
      >
        ← changer d’aliment
      </button>
    </div>
  );
}
