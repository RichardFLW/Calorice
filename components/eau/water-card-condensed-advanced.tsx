// components/eau/water-card-condensed-advanced.tsx
"use client";

import { useMemo } from "react";
import { Water } from "@/types/water";
import { Card } from "@/components/ui/card";

type Props = {
  data: Water[];
};

export function WaterListCondensedAdvanced({ data }: Props) {
  const electrolytes = ["calcium", "magnesium", "potassium", "sodium"] as const;

  // Déterminer les min/max pour chaque électrolyte
  const ranges = useMemo(() => {
    const minMax: Record<string, { min: number; max: number }> = {};
    for (const key of electrolytes) {
      const values = data.map((w) => w.sources[0]?.composition?.[key] ?? 0);
      minMax[key] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    }
    return minMax;
  }, [data]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {data.map((water) => {
        const comp = water.sources[0]?.composition;
        return (
          <Card
            key={water.name}
            className="p-4 text-sm rounded-2xl shadow-sm border border-muted bg-background hover:shadow-md transition"
          >
            <div className="font-semibold text-base mb-3 text-primary/90">
              {water.name}
            </div>
            <div className="space-y-2">
              {electrolytes.map((key) => {
                const value = comp?.[key] ?? 0;
                const { min, max } = ranges[key];
                const percent =
                  max > min ? ((value - min) / (max - min)) * 100 : 0;

                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className="w-20 text-xs font-medium capitalize text-muted-foreground">
                      {labels[key]}
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-muted relative overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full ${barColors[key]} rounded-full transition-all`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="w-12 text-end text-xs font-mono text-muted-foreground">
                      {value}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

const labels: Record<string, string> = {
  calcium: "Calcium",
  magnesium: "Magnésium",
  potassium: "Potassium",
  sodium: "Sodium",
};

const barColors: Record<string, string> = {
  calcium: "bg-blue-500",
  magnesium: "bg-purple-500",
  potassium: "bg-teal-500",
  sodium: "bg-yellow-500",
};
