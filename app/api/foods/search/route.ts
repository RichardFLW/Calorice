// app/api/foods/search/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    return NextResponse.json({ ok: true, items: [] });
  }

  const items = await prisma.food.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { brands: { contains: q, mode: "insensitive" } },
        { barcode: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      brands: true,
      barcode: true,
      servingSize: true,
      servingUnit: true,
      caloriesPer100g: true,
      caloriesPerPortion: true,
      fatPer100g: true,
      carbsPer100g: true,
      proteinPer100g: true,
      fatPerPortion: true,
      carbsPerPortion: true,
      proteinPerPortion: true,
    },
    take: 10,
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ ok: true, items });
}
