// app/dashboard/settings/actions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAccountAction(formData: FormData) {
  const confirm = (formData.get("confirm") || "")
    .toString()
    .trim()
    .toUpperCase();
  if (confirm !== "SUPPRIMER") {
    return {
      ok: false,
      message: "Saisissez exactement « SUPPRIMER » pour confirmer.",
    };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "Non autorisé." };
  }

  const userId = session.user.id;
  const userEmail = session.user.email ?? "";

  // 1) Détacher les aliments (on garde les enregistrements)
  //    Tentative #1 : modèle Food + createdById
  try {
    await prisma.food.updateMany({
      where: { createdById: userId },
      data: { createdById: null },
    });
  } catch {
    //  Tentative #2 : modèle Aliment + auteurId (si ton schéma utilise d’autres noms)
    try {
      // @ts-expect-error — champ/ modèle alternatif possible selon ton schéma
      await prisma.aliment.updateMany({
        where: { auteurId: userId },
        data: { auteurId: null },
      });
    } catch {}
  }

  // 2) Nettoyer comptes liés OAuth (même si tu n’en utilises pas aujourd’hui)
  try {
    await prisma.account.deleteMany({ where: { userId } });
  } catch {}

  // 3) Nettoyer tokens de vérification par email (Auth.js v5)
  try {
    // Selon ton schema Prisma Auth.js, le champ est généralement "identifier"
    await prisma.verificationToken.deleteMany({
      where: { identifier: userEmail },
    });
  } catch {}

  // 4) Supprimer l’utilisateur
  try {
    await prisma.user.delete({ where: { id: userId } });
  } catch {
    return {
      ok: false,
      message:
        "Impossible de supprimer le compte. Vérifiez les contraintes de base.",
    };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true, message: "Compte supprimé définitivement." };
}
