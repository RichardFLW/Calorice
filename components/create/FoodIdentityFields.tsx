"use client";

import { Controller } from "react-hook-form";

type Props = {
  control: any;
  errors: Record<string, any>;
};

export default function FoodIdentityFields({ control, errors }: Props) {
  return (
    <div className="space-y-4">
      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="mt-1 w-full rounded border px-3 py-2"
            />
          )}
        />
        {errors?.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Marque */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Marque
        </label>
        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="mt-1 w-full rounded border px-3 py-2"
            />
          )}
        />
        {errors?.brand && (
          <p className="mt-1 text-xs text-red-600">{errors.brand.message}</p>
        )}
      </div>

      {/* Code-barres */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Code-barres
        </label>
        <Controller
          name="barcode"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              className="mt-1 w-full rounded border px-3 py-2"
            />
          )}
        />
        {errors?.barcode && (
          <p className="mt-1 text-xs text-red-600">{errors.barcode.message}</p>
        )}
      </div>
    </div>
  );
}
