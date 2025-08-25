-- CreateEnum
CREATE TYPE "public"."Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ActivityLevel" AS ENUM ('SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE');

-- CreateEnum
CREATE TYPE "public"."Goal" AS ENUM ('LOSE_WEIGHT', 'MAINTAIN', 'GAIN_WEIGHT', 'RECOMP');

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "activity_level" "public"."ActivityLevel",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "goal" "public"."Goal",
ADD COLUMN     "height_cm" INTEGER,
ADD COLUMN     "sex" "public"."Sex",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "weight_kg" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."foods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brands" TEXT,
    "barcode" TEXT,
    "serving_size" DOUBLE PRECISION,
    "serving_unit" TEXT,
    "calories_per_100g" DOUBLE PRECISION,
    "fat_per_100g" DOUBLE PRECISION,
    "carbs_per_100g" DOUBLE PRECISION,
    "protein_per_100g" DOUBLE PRECISION,
    "calories_per_portion" DOUBLE PRECISION,
    "fat_per_portion" DOUBLE PRECISION,
    "carbs_per_portion" DOUBLE PRECISION,
    "protein_per_portion" DOUBLE PRECISION,
    "micros_per_100g" JSONB,
    "micros_per_portion" JSONB,
    "extra" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "foods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."meal_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "food_id" TEXT NOT NULL,
    "eaten_at" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION,
    "unit" TEXT,
    "calories" DOUBLE PRECISION,
    "macros_snapshot" JSONB,
    "micros_snapshot" JSONB,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "foods_barcode_key" ON "public"."foods"("barcode");

-- CreateIndex
CREATE INDEX "foods_name_idx" ON "public"."foods"("name");

-- CreateIndex
CREATE INDEX "foods_barcode_idx" ON "public"."foods"("barcode");

-- CreateIndex
CREATE INDEX "meal_entries_user_id_eaten_at_idx" ON "public"."meal_entries"("user_id", "eaten_at");

-- AddForeignKey
ALTER TABLE "public"."meal_entries" ADD CONSTRAINT "meal_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."meal_entries" ADD CONSTRAINT "meal_entries_food_id_fkey" FOREIGN KEY ("food_id") REFERENCES "public"."foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
