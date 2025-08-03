// types/water.ts

export type WaterCategory = "eau minérale" | "eau de source";
export type WaterSubcategory = "plate" | "gazeuse naturelle" | "gazéifiée";

export type MineralComposition = {
  calcium: number;
  magnesium: number;
  sodium: number;
  potassium: number;
  bicarbonates: number;
  sulfates: number;
  chlorures: number;
  fluorures: number;
  silice: number;
  nitrate: number;
  residu: number;
  ph: number;
};

export type WaterSource = {
  name: string;
  location?: string;
  composition: MineralComposition;
};

export type Water = {
  name: string;
  category: WaterCategory;
  subcategory: WaterSubcategory;
  sources: WaterSource[];
};
