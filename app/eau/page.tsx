// app/eau/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { waters } from "@/constants/waters";
import { WaterList } from "@/components/eau/water-list";

const filters = [
  { id: "nitrate0", label: "0 nitrate" },
  { id: "lowResidue", label: "Faible minéralisation" },
  { id: "highMagnesium", label: "Riche en magnésium" },
  { id: "highBicarbonate", label: "Riche en bicarbonates" },
  { id: "highSodium", label: "Riche en sodium" },
];

export default function EauPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  function toggleFilter(id: string) {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  const filteredWaters = waters.filter((w) => {
    return activeFilters.every((filter) => {
      switch (filter) {
        case "nitrate0":
          return w.nitrates === 0;
        case "lowResidue":
          return (w.dryResidue ?? Infinity) <= 50;
        case "highMagnesium":
          return (w.magnesium ?? 0) >= 50;
        case "highBicarbonate":
          return (w.bicarbonates ?? 0) >= 600;
        case "highSodium":
          return (w.sodium ?? 0) >= 200;
        default:
          return true;
      }
    });
  });

  return (
    <div className="w-full py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Comparateur d’eaux
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Compare les eaux selon leur minéralisation, sodium, résidus à sec,
              etc.
            </p>

            <div className="space-y-2">
              <Label htmlFor="search">Rechercher une eau</Label>
              <Input id="search" placeholder="Ex : Cristaline, Volvic..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">Trier par</Label>
              <Select>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Choisir un critère" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sodium">Sodium</SelectItem>
                  <SelectItem value="residus">Résidus à sec</SelectItem>
                  <SelectItem value="calcium">Calcium</SelectItem>
                  <SelectItem value="magnesium">Magnésium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4 flex flex-wrap justify-end gap-2">
              {filters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant={
                    activeFilters.includes(filter.id) ? "default" : "outline"
                  }
                  onClick={() => toggleFilter(filter.id)}
                  className="cursor-pointer select-none"
                >
                  {filter.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Toutes les eaux</h2>
          <p className="text-sm text-muted-foreground">
            Voici une liste de base que tu peux enrichir.
          </p>
          <WaterList data={filteredWaters} />
        </div>
      </div>
    </div>
  );
}
