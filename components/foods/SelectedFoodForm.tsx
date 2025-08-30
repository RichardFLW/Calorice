// components/foods/SelectedFoodForm.tsx
"use client";

import * as React from "react";
import type { FoodItem } from "./FoodSearch";

type AddAction = (
  formData: FormData
) => Promise<{ ok?: boolean; error?: string } | void>;

export default function SelectedFoodForm({
  food,
  addAction,
  onClose,
  initialQuery,
}: {
  food: FoodItem | null; // ← accepte le mode manuel (null)
  addAction: AddAction;
  onClose: () => void;
  initialQuery?: string;
}) {
  const hasFood = !!food?.id;

  // valeurs par défaut
  const defaultUnit =
    (hasFood &&
      (food!.servingUnit ??
        (food!.caloriesPerPortion != null ? "portion" : "g"))) ||
    "g";
  const [unit, setUnit] = React.useState<string>(defaultUnit);
  const [amount, setAmount] = React.useState<number>(
    hasFood
      ? defaultUnit === "g" || defaultUnit === "ml"
        ? food!.servingSize ?? 100
        : 1
      : 100
  );
  const [eatenAt, setEatenAt] = React.useState<string>(() =>
    toLocalDateTimeInput(new Date())
  );

  // En manuel, on force le mode override par défaut
  const [override, setOverride] = React.useState<boolean>(!hasFood);
  const [overrideKcal, setOverrideKcal] = React.useState<number | "">("");

  const computedKcal = React.useMemo(() => {
    if (override && typeof overrideKcal === "number") return overrideKcal;
    if (!hasFood) return null;
    if (unit === "g" || unit === "ml") {
      if (food!.caloriesPer100g != null)
        return (food!.caloriesPer100g * amount) / 100;
    } else if (unit === "portion") {
      if (food!.caloriesPerPortion != null)
        return food!.caloriesPerPortion * amount;
    }
    return null;
  }, [override, overrideKcal, unit, amount, hasFood, food]);

  const title = hasFood ? food!.name ?? "(Sans nom)" : "Entrée manuelle";
  const subtitle = hasFood
    ? (food!.brands && food!.brands.trim()) ||
      (food!.barcode ? `EAN: ${food!.barcode}` : "—")
    : (initialQuery && `Saisie pour “${initialQuery}”`) ||
      "Saisis une entrée sans aliment";

  return (
    <div className="rounded-2xl border shadow-sm p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-semibold truncate">{title}</div>
          <div className="text-sm text-muted-foreground truncate">
            {subtitle}
          </div>
        </div>
        <button onClick={onClose} className="text-sm underline">
          Annuler
        </button>
      </div>

      {/* Aperçu calories */}
      <div className="rounded-lg bg-gray-50 p-3 text-sm flex items-center justify-between">
        <span>
          Quantité : <strong>{amount}</strong> {unit}
        </span>
        <span>
          {computedKcal != null ? (
            <>
              ≈ <strong>{Math.round(computedKcal)}</strong> kcal
            </>
          ) : (
            <span className="text-muted-foreground">
              Calories non déterminables
            </span>
          )}
        </span>
      </div>

      {/* Formulaire détaillé */}
      <form
        action={addAction}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {hasFood && <input type="hidden" name="foodId" value={food!.id} />}

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Quantité</label>
          <input
            type="number"
            name="amount"
            inputMode="decimal"
            step="0.1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value || 0))}
            className="rounded-lg border px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Unité</label>
          <select
            name="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="g">g</option>
            <option value="ml">ml</option>
            <option value="portion">portion</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">Date & heure</label>
          <input
            type="datetime-local"
            name="eatenAt"
            value={eatenAt}
            onChange={(e) => setEatenAt(e.target.value)}
            className="rounded-lg border px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-muted-foreground">
            Forcer les calories
          </label>
          <div className="flex items-center gap-2">
            <input
              id="override"
              type="checkbox"
              checked={override}
              onChange={(e) => setOverride(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="override" className="text-sm">
              Saisir manuellement
            </label>
          </div>
          <input
            type="number"
            name="calories"
            inputMode="decimal"
            step="1"
            placeholder="kcal"
            value={override ? (overrideKcal as number | "") : ""}
            onChange={(e) =>
              setOverrideKcal(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            disabled={!override}
            className="mt-2 rounded-lg border px-3 py-2"
          />
        </div>

        <div className="sm:col-span-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white hover:opacity-90"
          >
            Ajouter l’entrée
          </button>
        </div>
      </form>

      <p className="text-xs text-muted-foreground">
        Astuce : si les calories ne se calculent pas automatiquement, coche
        “Forcer les calories” et saisis la valeur exacte.
      </p>
    </div>
  );
}

function toLocalDateTimeInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const MM = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
}
