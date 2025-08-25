// app/api/db-check/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // simple ping: lit la version via une requête SQL brute
    const result = await prisma.$queryRaw<
      { version: string }[]
    >`SELECT version();`;
    return NextResponse.json({ ok: true, version: result[0]?.version ?? null });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "error" },
      { status: 500 }
    );
  }
}
