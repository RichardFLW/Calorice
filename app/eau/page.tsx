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

export default function EauPage() {
  return (
    <div className="container py-10 space-y-8">
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

          {/* 🔍 Barre de recherche */}
          <div className="space-y-2">
            <Label htmlFor="search">Rechercher une eau</Label>
            <Input id="search" placeholder="Ex : Cristaline, Volvic..." />
          </div>

          {/* 🔽 Filtres de comparaison (ex. tri par sodium, résidus, etc.) */}
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
        </CardContent>
      </Card>

      {/* 🧪 Espace pour la table ou la liste des eaux */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Résultats</h2>
        <p className="text-sm text-muted-foreground">
          Affichage des eaux filtrées ou triées (à venir).
        </p>
      </div>
    </div>
  );
}
