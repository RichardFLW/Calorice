// components/eau/water-card.tsx
"use client";

import { useState } from "react";
import { Water } from "@/types/water";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function WaterCard({ water }: { water: Water }) {
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const currentSource = water.sources[selectedSourceIndex];

  const handleSourceChange = (value: string) => {
    const index = water.sources.findIndex((s) => s.name === value);
    if (index !== -1) setSelectedSourceIndex(index);
  };

  return (
    <Card className="w-full relative">
      {/* Source dans le coin haut droit */}
      {water.sources.length > 1 && water.name.toLowerCase() === "cristaline" ? (
        <div className="absolute right-4 top-4 text-xs text-muted-foreground italic">
          <Select
            onValueChange={handleSourceChange}
            defaultValue={currentSource.name}
          >
            <SelectTrigger className="text-xs w-fit px-2 py-0 h-auto min-h-6 border-muted">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {water.sources.map((source) => (
                <SelectItem key={source.name} value={source.name}>
                  {source.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="absolute right-4 top-4 text-xs text-muted-foreground italic">
          {currentSource.location || currentSource.name}
        </div>
      )}

      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{water.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {capitalize(water.category)} – {formatSub(water.subcategory)}
        </p>
      </CardHeader>

      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        {Object.entries(mineralLabels).map(([key, label]) =>
          currentSource.composition[
            key as keyof typeof currentSource.composition
          ] !== undefined ? (
            <div key={key} className="flex flex-col">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground">
                {
                  currentSource.composition[
                    key as keyof typeof currentSource.composition
                  ]
                }
              </span>
            </div>
          ) : null
        )}
      </CardContent>

      <div className="px-4 pt-4 text-end text-xs text-muted-foreground italic">
        Toutes les valeurs exprimées en mg/L, sauf pH.
      </div>
    </Card>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatSub(sub: string) {
  if (sub === "gazeuse naturelle") return "gazeuse naturelle";
  if (sub === "gazéifiée") return "gazéifiée (ajout de CO₂)";
  return sub;
}

const mineralLabels: Record<string, string> = {
  residu: "Résidus",
  ph: "pH",
  sodium: "Sodium",
  calcium: "Calcium",
  magnesium: "Magnésium",
  potassium: "Potassium",
  bicarbonates: "Bicarbonates",
  sulfates: "Sulfates",
  chlorures: "Chlorures",
  silice: "Silicates",
  nitrate: "Nitrates",
  fluorures: "Fluor",
};
