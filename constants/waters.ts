// constants/waters.ts

import type { WaterBrand } from "@/types/water";

export const waters: WaterBrand[] = [
  {
    name: "Volvic",
    category: "eau minérale",
    subcategory: "plate",
    sourceLocation: "Volvic (Puy-de-Dôme)",
    pH: 7,
    dryResidue: 130,
    calcium: 11.5,
    magnesium: 8,
    sodium: 11.6,
    potassium: 6.2,
    nitrates: 6.3,
    silicates: 32,
  },
  {
    name: "Cristaline",
    category: "eau de source",
    subcategory: "plate",
    sourceLocation: "variable (plusieurs sources)",
    dryResidue: 200,
    pH: 7.2,
    calcium: 30,
    magnesium: 5,
    sodium: 4,
  },
  {
    name: "Saint-Yorre",
    category: "eau minérale",
    subcategory: "gazeuse naturelle",
    sourceLocation: "Saint-Yorre (Allier)",
    pH: 6.1,
    dryResidue: 4774,
    calcium: 92,
    magnesium: 120,
    sodium: 1708,
    potassium: 125,
    bicarbonates: 4368,
    fluorides: 0.3,
  },
];
