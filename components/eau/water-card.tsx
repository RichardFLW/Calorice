// components/eau/water-card.tsx
"use client";

import { WaterBrand } from "@/types/water";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function WaterCard({ water }: { water: WaterBrand }) {
  return (
    <Card className="w-full relative">
      {/* Source dans le coin haut droit */}
      {water.sourceLocation && (
        <div className="absolute right-4 top-4 text-xs text-muted-foreground italic">
          {water.sourceLocation}
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
          water[key as keyof WaterBrand] !== undefined ? (
            <div key={key} className="flex flex-col">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground">
                {water[key as keyof WaterBrand]}{" "}
                {units[key as keyof WaterBrand] ?? ""}
              </span>
            </div>
          ) : null
        )}
      </CardContent>
    </Card>
  );
}

function renderItem(label: string, value?: number, unit?: string) {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">
        {value !== undefined ? `${value}${unit ? ` ${unit}` : ""}` : "–"}
      </span>
    </div>
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

const mineralLabels: Partial<Record<keyof WaterBrand, string>> = {
  dryResidue: "Résidus",
  pH: "pH",
  sodium: "Sodium",
  calcium: "Calcium",
  magnesium: "Magnésium",
  potassium: "Potassium",
  bicarbonates: "Bicarbonates",
  sulfates: "Sulfates",
  chlorides: "Chlorures",
  silicates: "Silicates",
  nitrates: "Nitrates",
  fluorides: "Fluor",
};

const units: Partial<Record<keyof WaterBrand, string>> = {
  dryResidue: "mg/L",
  sodium: "mg/L",
  calcium: "mg/L",
  magnesium: "mg/L",
  potassium: "mg/L",
  bicarbonates: "mg/L",
  sulfates: "mg/L",
  chlorides: "mg/L",
  silicates: "mg/L",
  nitrates: "mg/L",
  fluorides: "mg/L",
};
