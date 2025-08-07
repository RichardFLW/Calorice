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
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp } from "lucide-react";

export function WaterCard({ water }: { water: Water }) {
  const [selectedSourceIndex, setSelectedSourceIndex] = useState(0);
  const [showBenefits, setShowBenefits] = useState(false);
  const currentSource = water.sources[selectedSourceIndex];

  const handleSourceChange = (value: string) => {
    const index = water.sources.findIndex((s) => s.name === value);
    if (index !== -1) setSelectedSourceIndex(index);
  };

  const leftKeys = [
    "residu",
    "ph",

    "chlorures",
    "bicarbonates",
    "sulfates",
    "silice",
    "nitrate",
    "fluorures",
  ];

  const rightKeys = [
    "calcium",
    "magnesium",
    "potassium",
    "sodium",
    
  ];

  return (
    <Card className="w-full relative p-5">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-semibold">{water.name} </CardTitle>

        <p className="text-sm text-muted-foreground">
          {capitalize(water.category)} – {formatSub(water.subcategory)}
        </p>
      </CardHeader>

      <hr className="border-muted" />

      {/* Source (sélecteur si Cristaline) */}
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

      <CardContent>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4 text-sm">
          <div className="space-y-2">
            {leftKeys.map((key) => {
              const value =
                currentSource.composition[
                  key as keyof typeof currentSource.composition
                ];
              return value !== undefined ? (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{mineralLabels[key]}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ) : null;
            })}
          </div>
          <div className="space-y-2">
            {rightKeys.map((key) => {
              const value =
                currentSource.composition[
                  key as keyof typeof currentSource.composition
                ];
              return value !== undefined ? (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">{mineralLabels[key]}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <hr className="border-muted my-3" />

        <span className="block text-xs text-muted-foreground pb-4">
          {water.verified && (
            <Badge className="bg-green-100 text-green-700 border border-green-300 text-[10px] mr-2">
              Vérifié
            </Badge>
          )}
          Toutes les valeurs exprimées en mg/L, sauf pH.
        </span>

        {Array.isArray(currentSource.benefits) &&
          currentSource.benefits.length > 0 && (
            <>
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setShowBenefits((prev) => !prev)}
                  className="flex items-center gap-1 hover:text-foreground text-xs"
                >
                  {showBenefits ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {showBenefits
                    ? "Masquer les bienfaits"
                    : "Voir les bienfaits"}
                </button>
              </div>

              {showBenefits && (
                <div className="pt-2">
                  <ul className="pl-4 list-disc text-xs text-muted-foreground space-y-1">
                    {currentSource.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
      </CardContent>
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
