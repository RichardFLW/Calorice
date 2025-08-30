// components/foods/FoodCreateForm.tsx
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFoodAction } from "@/app/dashboard/foods/actions";

const schema = z.object({
  name: z.string().min(1, "Nom requis"),
  brands: z.string().optional(),
  barcode: z.string().optional(),
  servingSize: z.coerce.number().positive().optional(),
  servingUnit: z.enum(["g", "ml", "portion"]).optional(),
  caloriesPer100g: z.coerce.number().nonnegative().optional(),
  caloriesPerPortion: z.coerce.number().nonnegative().optional(),
  fatPer100g: z.coerce.number().nonnegative().optional(),
  carbsPer100g: z.coerce.number().nonnegative().optional(),
  proteinPer100g: z.coerce.number().nonnegative().optional(),
  fatPerPortion: z.coerce.number().nonnegative().optional(),
  carbsPerPortion: z.coerce.number().nonnegative().optional(),
  proteinPerPortion: z.coerce.number().nonnegative().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function FoodCreateForm({
  initialName,
  onCancel,
  onCreated,
}: {
  initialName?: string;
  onCancel: () => void;
  onCreated: (food: { id: string; name: string | null }) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialName ?? "",
      servingSize: 100,
      servingUnit: "g",
    },
  });

  const onSubmit = async (values: FormValues) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) {
      if (v === undefined || v === null || v === "") continue;
      fd.append(k, String(v));
    }
    const res = await createFoodAction(fd);
    if (res?.error) {
      alert(res.error);
      return;
    }
    if (res?.ok && res.food) {
      onCreated(res.food);
      reset();
    }
  };

  return (
    <div className="rounded-2xl border shadow-sm p-4 space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold">Créer un aliment</h3>
        <button onClick={onCancel} className="text-sm underline">
          Annuler
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <Field label="Nom" error={errors.name?.message}>
          <input
            {...register("name")}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>

        <Field label="Marques">
          <input
            {...register("brands")}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>

        <Field label="Code-barres (EAN)">
          <input
            {...register("barcode")}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Taille portion">
            <input
              type="number"
              step="0.1"
              {...register("servingSize")}
              className="w-full rounded-lg border px-3 py-2"
            />
          </Field>
          <Field label="Unité portion">
            <select
              {...register("servingUnit")}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="portion">portion</option>
            </select>
          </Field>
        </div>

        <Field label="Kcal / 100g">
          <input
            type="number"
            step="0.1"
            {...register("caloriesPer100g")}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>
        <Field label="Kcal / portion">
          <input
            type="number"
            step="0.1"
            {...register("caloriesPerPortion")}
            className="w-full rounded-lg border px-3 py-2"
          />
        </Field>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Lipides / 100g">
            <input
              type="number"
              step="0.1"
              {...register("fatPer100g")}
              className="rounded-lg border px-3 py-2"
            />
          </Field>
          <Field label="Glucides / 100g">
            <input
              type="number"
              step="0.1"
              {...register("carbsPer100g")}
              className="rounded-lg border px-3 py-2"
            />
          </Field>
          <Field label="Protéines / 100g">
            <input
              type="number"
              step="0.1"
              {...register("proteinPer100g")}
              className="rounded-lg border px-3 py-2"
            />
          </Field>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Lipides / portion">
            <input
              type="number"
              step="0.1"
              {...register("fatPerPortion")}
              className="rounded-lg border px-3 py-2"
            />
          </Field>
          <Field label="Glucides / portion">
            <input
              type="number"
              step="0.1"
              {...register("carbsPerPortion")}
              className="rounded-lg border px-3 py-2"
            />
          </Field>
          <Field label="Protéines / portion">
            <input
              type="number"
              step="0.1"
              {...register("proteinPerPortion")}
              className="rounded-lg border px-3 py-2"
            />
          </Field>
        </div>

        <div className="md:col-span-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Enregistrement…" : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-muted-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
