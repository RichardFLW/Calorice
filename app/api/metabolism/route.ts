// app/api/metabolism/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  mifflinStJeor,
  activityFactor,
  goalFactor,
  round,
  type ActivityLevel,
  type Goal,
  type Sex,
} from "@/lib/metabolism";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      sex: true,
      age: true,
      weightKg: true,
      heightCm: true,
      activityLevel: true,
      goal: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "User not found" },
      { status: 404 }
    );
  }

  const missing: string[] = [];
  if (!user.sex || !["MALE", "FEMALE"].includes(user.sex)) missing.push("sex");
  if (typeof user.age !== "number") missing.push("age");
  if (typeof user.weightKg !== "number" || user.weightKg <= 0)
    missing.push("weightKg");
  if (typeof user.heightCm !== "number" || user.heightCm <= 0)
    missing.push("heightCm");
  if (!user.activityLevel) missing.push("activityLevel");
  if (!user.goal) missing.push("goal");

  if (missing.length) {
    return NextResponse.json(
      { ok: false, missing, error: "Incomplete profile" },
      { status: 400 }
    );
  }

  const sex = user.sex as Sex;
  const level = user.activityLevel as ActivityLevel;
  const goal = user.goal as Goal;

  const bmr = mifflinStJeor({
    sex,
    weightKg: user.weightKg as number,
    heightCm: user.heightCm as number,
    age: user.age as number,
  });

  const af = activityFactor(level);
  const tdee = bmr * af;

  const gf = goalFactor(goal);
  const target = tdee * gf;

  return NextResponse.json({
    ok: true,
    profile: {
      sex,
      age: user.age,
      weightKg: user.weightKg,
      heightCm: user.heightCm,
      activityLevel: level,
      goal,
    },
    results: {
      bmr: round(bmr),
      tdee: round(tdee),
      target: round(target),
      activityFactor: af,
      goalFactor: gf,
    },
  });
}
