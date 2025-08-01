// types/water.ts

export type WaterCategory = "eau minérale" | "eau de source";

export type WaterSubcategory = "plate" | "gazeuse naturelle" | "gazéifiée";

export type WaterBrand = {
  name: string;
  category: WaterCategory;
  subcategory: WaterSubcategory;
  sourceLocation?: string;
  pH?: number;
  dryResidue?: number; // Résidus à sec (mg/L)
  calcium?: number;
  magnesium?: number;
  sodium?: number;
  potassium?: number;
  bicarbonates?: number;
  sulfates?: number;
  chlorides?: number;
  fluorides?: number;
  nitrates?: number;
  silicates?: number;
};
