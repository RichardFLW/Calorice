// components/eau/water-list.tsx
"use client";

import { Water } from "@/types/water";
import { WaterCard } from "./water-card";

export function WaterList({ data }: { data: Water[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {data.map((water) => (
        <WaterCard key={water.name} water={water} />
      ))}
    </div>
  );
}
