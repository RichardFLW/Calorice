// components/eau/water-list.tsx
"use client";

import { WaterBrand } from "@/types/water";
import { WaterCard } from "./water-card";

export function WaterList({ data }: { data: WaterBrand[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {data.map((water) => (
        <WaterCard key={water.name} water={water} />
      ))}
    </div>
  );
}
