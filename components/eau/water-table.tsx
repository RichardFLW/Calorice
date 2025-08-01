// components/eau/water-table.tsx
"use client";

import { WaterBrand } from "@/types/water";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function WaterTable({ data }: { data: WaterBrand[] }) {
  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Sous-type</TableHead>
            <TableHead>Résidus à sec (mg/L)</TableHead>
            <TableHead>Sodium (mg/L)</TableHead>
            <TableHead>Calcium</TableHead>
            <TableHead>Magnésium</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((water) => (
            <TableRow key={water.name}>
              <TableCell className="font-medium">{water.name}</TableCell>
              <TableCell>{water.category}</TableCell>
              <TableCell>{water.subcategory}</TableCell>
              <TableCell>{water.dryResidue ?? "–"}</TableCell>
              <TableCell>{water.sodium ?? "–"}</TableCell>
              <TableCell>{water.calcium ?? "–"}</TableCell>
              <TableCell>{water.magnesium ?? "–"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
