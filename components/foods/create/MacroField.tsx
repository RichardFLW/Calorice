"use client";

import { Controller } from "react-hook-form";

type Props = {
  control: any;
  errors: Record<string, any>;
  name: string;
  label: string;
  unit?: string;
};

export default function MacroField({
  control,
  errors,
  name,
  label,
  unit,
}: Props) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id={name}
              type="number"
              step="any"
              className="w-full rounded border px-3 py-2 text-sm"
            />
          )}
        />
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      {errors?.[name] && (
        <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>
      )}
    </div>
  );
}
