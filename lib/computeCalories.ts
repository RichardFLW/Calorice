/**
 * Calcule les calories totales en fonction de l’unité, quantité et données de référence.
 */
export function computeCalories(opts: {
  caloriesPer100g?: number | null;
  caloriesPerPortion?: number | null;
  servingSize?: number | null; // ex: 30
  unit: "g" | "ml" | "portion";
  amount: number; // ex: 100 g, ou 1 portion
}): number | null {
  const { caloriesPer100g, caloriesPerPortion, servingSize, unit, amount } =
    opts;

  if (unit === "portion") {
    if (typeof caloriesPerPortion === "number") {
      return caloriesPerPortion * amount;
    }
    if (
      typeof caloriesPer100g === "number" &&
      typeof servingSize === "number" &&
      servingSize > 0
    ) {
      return (caloriesPer100g * servingSize * amount) / 100;
    }
    return null;
  }

  // g / ml
  if (typeof caloriesPer100g === "number") {
    return (caloriesPer100g * amount) / 100;
  }
  if (
    typeof caloriesPerPortion === "number" &&
    typeof servingSize === "number" &&
    servingSize > 0
  ) {
    const per100 = (caloriesPerPortion * 100) / servingSize;
    return (per100 * amount) / 100;
  }
  return null;
}
