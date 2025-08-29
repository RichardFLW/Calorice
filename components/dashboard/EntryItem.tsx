"use client";

import { useTransition } from "react";

type Entry = {
  id: string;
  eatenAt: Date;
  amount: number;
  unit: string;
  calories: number;
  food: { name: string; brands: string | null };
};

type Props = {
  entry: Entry;
  removeAction: (prevState: any, formData: FormData) => Promise<any>;
};

export default function EntryItem({ entry, removeAction }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", entry.id);
      await removeAction(undefined, formData);
    });
  };

  return (
    <li className="flex items-center justify-between p-3 bg-white rounded shadow">
      <div>
        <p className="font-medium">{entry.food.name}</p>
        <p className="text-sm text-gray-500">
          {entry.amount} {entry.unit} • {entry.calories} kcal
        </p>
      </div>
      <button
        onClick={handleRemove}
        disabled={isPending}
        className="text-red-500 hover:underline disabled:opacity-50"
      >
        Supprimer
      </button>
    </li>
  );
}
