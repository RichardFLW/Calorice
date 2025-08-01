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
import { waters } from "@/constants/waters";
import { WaterList } from "@/components/eau/water-List";

export default function EauPage() {
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
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Toutes les eaux</h2>
          <p className="text-sm text-muted-foreground">
            Voici une liste de base que tu peux enrichir.
          </p>
          <WaterList data={waters} />
        </div>
      </div>
    </div>
  );
}
