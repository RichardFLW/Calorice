// components/eau/eau-client.tsx
"use client";

import { useState } from "react";
import { waters } from "@/constants/waters";
import { WaterList } from "@/components/eau/water-list";
import { WaterListCondensedAdvanced } from "@/components/eau/water-card-condensed-advanced";
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
import { Toggle } from "@/components/ui/toggle";

type SortKey = "sodium" | "residu" | "calcium" | "magnesium" | "alphabetique";
type SortOrder = "asc" | "desc";

function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

const filters = [
  { id: "nitrate0", label: "0 nitrate" },
  { id: "lowResidue", label: "Faible minéralisation" },
  { id: "highMagnesium", label: "Riche en magnésium" },
  { id: "highBicarbonate", label: "Riche en bicarbonates" },
  { id: "highSodium", label: "Riche en sodium" },
];

export default function EauClient() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isCondensed, setIsCondensed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  function toggleFilter(id: string) {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }

  function resetAll() {
    setSearchTerm("");
    setSortKey(undefined);
    setSortOrder("desc");
    setActiveFilters([]);
  }

  const filteredWaters = waters
    .filter((w) => {
      return activeFilters.every((filter) => {
        const source = w.sources[0];
        const comp = source?.composition || {};
        switch (filter) {
          case "nitrate0":
            return comp.nitrate === 0;
          case "lowResidue":
            return comp.residu <= 50;
          case "highMagnesium":
            return comp.magnesium >= 50;
          case "highBicarbonate":
            return comp.bicarbonates >= 600;
          case "highSodium":
            return comp.sodium >= 200;
          default:
            return true;
        }
      });
    })
    .filter(
      (w) =>
        typeof w.name === "string" &&
        normalize(w.name).includes(normalize(searchTerm.trim()))
    )
    .sort((a, b) => {
      if (!sortKey || searchTerm.length > 0) return 0;

      if (sortKey === "alphabetique") {
        return sortOrder === "asc"
          ? normalize(a.name).localeCompare(normalize(b.name))
          : normalize(b.name).localeCompare(normalize(a.name));
      }

      const aVal = a.sources?.[0]?.composition?.[sortKey] ?? 0;
      const bVal = b.sources?.[0]?.composition?.[sortKey] ?? 0;
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
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
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Explore et compare les eaux selon leur minéralisation, sodium,
              résidus à sec, etc.
            </p>

            {/* 🔍 Barre de recherche compacte */}
            <div className="space-y-1">
              <Label htmlFor="search">Rechercher une eau</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="search"
                  placeholder="Ex : Cristaline, Volvic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:max-w-xs"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    Effacer
                  </button>
                )}
              </div>
            </div>

            {/* 🔃 Tri + flèche */}
            <div className="space-y-1">
              <Label htmlFor="sort">Trier par</Label>
              <div className="flex items-center gap-2">
                <Select
                  onValueChange={(val) => setSortKey(val as SortKey)}
                  disabled={searchTerm.length > 0}
                >
                  <SelectTrigger id="sort" className="w-48">
                    <SelectValue
                      placeholder={
                        searchTerm
                          ? "Désactivé pendant la recherche"
                          : "Choisir un critère"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetique">
                      Ordre alphabétique
                    </SelectItem>
                    <SelectItem value="sodium">Sodium</SelectItem>
                    <SelectItem value="residu">Résidus à sec</SelectItem>
                    <SelectItem value="calcium">Calcium</SelectItem>
                    <SelectItem value="magnesium">Magnésium</SelectItem>
                  </SelectContent>
                </Select>

                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  disabled={!sortKey || searchTerm.length > 0}
                  className="text-muted-foreground hover:text-foreground text-xl transition"
                  title={`Trier en ordre ${
                    sortOrder === "asc" ? "décroissant" : "croissant"
                  }`}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>

            {/* 🏷️ Badges de filtres */}
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

            {/* ♻️ Bouton de réinitialisation */}
            <div className="flex justify-end pt-2">
              <button
                onClick={resetAll}
                className="text-xs text-muted-foreground hover:underline"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 📋 Liste des eaux */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Toutes les eaux</h2>
            <Toggle
              pressed={isCondensed}
              onPressedChange={setIsCondensed}
              className="text-xs"
            >
              Vue simplifiée
            </Toggle>
          </div>
          <p className="text-sm text-muted-foreground">
            Voici une liste de base que tu peux enrichir.
          </p>

          {filteredWaters.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-6">
              Aucune eau ne correspond à ta recherche ou aux filtres
              sélectionnés.
            </div>
          ) : isCondensed ? (
            <WaterListCondensedAdvanced data={filteredWaters} />
          ) : (
            <WaterList data={filteredWaters} />
          )}
        </div>
      </div>
    </div>
  );
}
