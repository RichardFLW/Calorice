// components/eau/water-card-condensed-advanced.tsx
"use client";

import { useMemo, useState } from "react";
import { Water } from "@/types/water";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

type Props = {
  data: Water[];
};

const electrolytes = ["calcium", "magnesium", "potassium", "sodium"] as const;

export function WaterListCondensedAdvanced({ data }: Props) {

  const [selectedSource, setSelectedSource] = useState<Record<string, number>>(
    {}
  );
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const ranges = useMemo(() => {
    const minMax: Record<string, { min: number; max: number }> = {};
    for (const key of electrolytes) {
      const values = data.flatMap((w) =>
        w.sources.map((s) => s.composition?.[key] ?? 0)
      );
      minMax[key] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    }
    return minMax;
  }, [data]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {data.map((water) => (
        <WaterCardCondensed
          key={water.name}
          water={water}
          selectedSourceIndex={selectedSource[water.name] ?? 0}
          setSelectedSource={(idx) =>
            setSelectedSource((prev) => ({ ...prev, [water.name]: idx }))
          }
          isOpen={openMap[water.name] ?? false}
          setOpen={(open) =>
            setOpenMap((prev) => ({ ...prev, [water.name]: open }))
          }
          ranges={ranges}
        />
      ))}
    </div>
  );
}

// ✅ Carte condensée
function WaterCardCondensed({
  water,
  selectedSourceIndex,
  setSelectedSource,
  isOpen,
  setOpen,
  ranges,
}: {
  water: Water;
  selectedSourceIndex: number;
  setSelectedSource: (index: number) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  ranges: Record<string, { min: number; max: number }>;
}) {
  const source = water.sources[selectedSourceIndex];
  const comp = source?.composition;

  return (
    <Card className="p-4 text-sm rounded-2xl shadow-sm border border-muted bg-background hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="font-medium">{water.name}</p>
          {water.verified && (
            <Badge className="bg-green-100 text-green-700 border border-green-300 text-[10px]">
              Vérifié
            </Badge>
          )}
        </div>

        {water.sources.length > 1 && (
          <Popover open={isOpen} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1 text-xs w-44">
              <ul className="space-y-1">
                {water.sources.map((s, idx) => (
                  <li
                    key={idx}
                    className={`px-2 py-1 cursor-pointer rounded hover:bg-muted-foreground/10 ${
                      selectedSourceIndex === idx
                        ? "bg-muted-foreground/5 font-medium"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedSource(idx);
                      setOpen(false);
                    }}
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        )}
      </div>

      <div className="space-y-2">
        {(["calcium", "magnesium", "potassium", "sodium"] as const).map(
          (key) => (
            <ElectrolyteBar
              key={key}
              label={labels[key]}
              colorClass={barColors[key]}
              value={comp?.[key] ?? 0}
              min={ranges[key].min}
              max={ranges[key].max}
            />
          )
        )}
      </div>
    </Card>
  );
}

// ✅ Barre individuelle
function ElectrolyteBar({
  label,
  colorClass,
  value,
  min,
  max,
}: {
  label: string;
  colorClass: string;
  value: number;
  min: number;
  max: number;
}) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 text-xs font-medium capitalize text-muted-foreground">
        {label}
      </div>
      <div className="flex-1 h-2 rounded-full bg-muted relative overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full ${colorClass} rounded-full transition-all`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="w-12 text-end text-xs font-mono text-muted-foreground">
        {value}
      </div>
    </div>
  );
}

// 🔤 Labels & couleurs
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
