// app/dashboard/profile/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ProfileFormState = {
  ok?: boolean;
  formError?: string;
  errors?: Partial<Record<keyof ProfileInput, string>>;
};

// ✅ Sex limité à MALE/FEMALE (pas d’option OTHER)
const schema = z.object({
  sex: z.enum(["MALE", "FEMALE"]),
  age: z.coerce
    .number()
    .int()
    .min(10, "Âge minimum 10 ans.")
    .max(120, "Âge maximum 120 ans."),
  weightKg: z.coerce
    .number()
    .positive("Poids invalide.")
    .max(500, "Poids trop élevé."),
  heightCm: z.coerce
    .number()
    .int()
    .min(50, "Taille trop faible.")
    .max(260, "Taille trop élevée."),
  activityLevel: z.enum([
    "SEDENTARY",
    "LIGHT",
    "MODERATE",
    "ACTIVE",
    "VERY_ACTIVE",
  ]),
  goal: z.enum(["LOSE_WEIGHT", "MAINTAIN", "GAIN_WEIGHT", "RECOMP"]),
});

export type ProfileInput = z.infer<typeof schema>;

export async function updateProfileAction(
  _prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  try {
    const session = await auth();
    if (!session?.user?.email) return { formError: "Non connecté." };

    const data = {
      sex: formData.get("sex"),
      age: formData.get("age"),
      weightKg: formData.get("weightKg"),
      heightCm: formData.get("heightCm"),
      activityLevel: formData.get("activityLevel"),
      goal: formData.get("goal"),
    };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!errors[key]) errors[key] = issue.message;
      }
      return { errors };
    }

    await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        sex: parsed.data.sex,
        age: parsed.data.age,
        weightKg: parsed.data.weightKg,
        heightCm: parsed.data.heightCm,
        activityLevel: parsed.data.activityLevel,
        goal: parsed.data.goal,
      },
    });

    revalidatePath("/dashboard/profile");
    return { ok: true };
  } catch (e: any) {
    return { formError: e?.message ?? "Erreur serveur." };
  }
}
