// lib/prisma.ts
import { PrismaClient, Prisma } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

export const prisma =
  global._prisma ??
  new PrismaClient({
    // log: ["query"], // décommente en debug si besoin
  });

if (process.env.NODE_ENV !== "production") {
  global._prisma = prisma;
}

/**
 * Retourne le delegate Prisma pour les "entrées" si disponible, sinon null.
 * N'EXPL0SE PLUS si le modèle n'existe pas encore (ex: DB seulement NextAuth).
 */
export function getEntriesDelegateOrNull(client: PrismaClient) {
  const ModelName =
    (Prisma as unknown as { ModelName?: Record<string, string> }).ModelName ??
    {};

  const candidates = [
    ModelName.MealEntry && "mealEntry",
    ModelName.FoodEntry && "foodEntry",
    ModelName.Entry && "entry",
    ModelName.LogEntry && "logEntry",
    ModelName.Intake && "intake",
    ModelName.Consumption && "consumption",
    ModelName.Meal && "meal",
  ].filter(Boolean) as string[];

  for (const key of candidates) {
    const delegate = (client as unknown as Record<string, unknown>)[key];
    if (delegate && typeof (delegate as any).findMany === "function") {
      return delegate as { findMany: (args: unknown) => Promise<any[]> };
    }
  }
  return null;
}
