// types/water.ts

export type WaterCategory = "eau minérale" | "eau de source";

export type WaterSubcategory =
  | "plate"
  | "gazeuse"
  | "naturellement gazeuse"
  | "gazéifiée";

export type WaterBrand = {
  name: string;
  category: WaterCategory;
  subcategory: WaterSubcategory;
  sourceLocation?: string;
  pH?: number;
  dryResidue?: number; // mg/L
  calcium?: number; // mg/L
  magnesium?: number; // mg/L
  sodium?: number; // mg/L
  potassium?: number; // mg/L
  bicarbonates?: number; // mg/L
  sulfates?: number; // mg/L
  chlorides?: number; // mg/L
  fluorides?: number; // mg/L
  nitrates?: number; // mg/L
  silicates?: number; // mg/L
};
