// lib/metabolism.ts
export type Sex = "MALE" | "FEMALE";
export type ActivityLevel =
  | "SEDENTARY"
  | "LIGHT"
  | "MODERATE"
  | "ACTIVE"
  | "VERY_ACTIVE";
export type Goal = "LOSE_WEIGHT" | "MAINTAIN" | "GAIN_WEIGHT" | "RECOMP";

export function mifflinStJeor(params: {
  sex: Sex;
  weightKg: number;
  heightCm: number;
  age: number;
}): number {
  const { sex, weightKg, heightCm, age } = params;
  // Mifflin-St Jeor
  // Homme: BMR = 10*w + 6.25*h - 5*age + 5
  // Femme: BMR = 10*w + 6.25*h - 5*age - 161
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const adj = sex === "MALE" ? 5 : -161;
  return base + adj;
}

export function activityFactor(level: ActivityLevel): number {
  switch (level) {
    case "SEDENTARY":
      return 1.2;
    case "LIGHT":
      return 1.375;
    case "MODERATE":
      return 1.55;
    case "ACTIVE":
      return 1.725;
    case "VERY_ACTIVE":
      return 1.9;
    default:
      return 1.2;
  }
}

export function goalFactor(goal: Goal): number {
  switch (goal) {
    case "LOSE_WEIGHT":
      return 0.85; // ~-15%
    case "GAIN_WEIGHT":
      return 1.15; // ~+15%
    case "RECOMP":
      return 0.95; // léger déficit
    case "MAINTAIN":
    default:
      return 1.0;
  }
}

export function round(n: number): number {
  return Math.round(n);
}
