// components/eau/water-card.tsx
"use client";

import { WaterBrand } from "@/types/water";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WaterCard({ water }: { water: WaterBrand }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{water.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {water.category} – {water.subcategory}
        </p>
        {water.sourceLocation && (
          <p className="text-xs text-muted-foreground italic">
            Source : {water.sourceLocation}
          </p>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
        {water.dryResidue !== undefined && (
          <Item label="Résidus" value={water.dryResidue} unit="mg/L" />
        )}
        {water.pH !== undefined && <Item label="pH" value={water.pH} />}
        {water.sodium !== undefined && (
          <Item label="Sodium" value={water.sodium} unit="mg/L" />
        )}
        {water.calcium !== undefined && (
          <Item label="Calcium" value={water.calcium} unit="mg/L" />
        )}
        {water.magnesium !== undefined && (
          <Item label="Magnésium" value={water.magnesium} unit="mg/L" />
        )}
        {water.potassium !== undefined && (
          <Item label="Potassium" value={water.potassium} unit="mg/L" />
        )}
        {water.bicarbonates !== undefined && (
          <Item label="Bicarbonates" value={water.bicarbonates} unit="mg/L" />
        )}
        {water.sulfates !== undefined && (
          <Item label="Sulfates" value={water.sulfates} unit="mg/L" />
        )}
        {water.chlorides !== undefined && (
          <Item label="Chlorures" value={water.chlorides} unit="mg/L" />
        )}
        {water.silicates !== undefined && (
          <Item label="Silicates" value={water.silicates} unit="mg/L" />
        )}
        {water.nitrates !== undefined && (
          <Item label="Nitrates" value={water.nitrates} unit="mg/L" />
        )}
        {water.fluorides !== undefined && (
          <Item label="Fluor" value={water.fluorides} unit="mg/L" />
        )}
      </CardContent>
    </Card>
  );
}

function Item({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">
        {value}
        {unit && <span className="text-xs"> {unit}</span>}
      </span>
    </div>
  );
}
