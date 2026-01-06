/*
  Warnings:

  - The primary key for the `city` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `province` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `city` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `provinceId` on the `city` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `province` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `province` on the `user_address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `city` on the `user_address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "city" DROP CONSTRAINT "city_provinceId_fkey";

-- DropForeignKey
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_city_fkey";

-- DropForeignKey
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_province_fkey";

-- AlterTable
ALTER TABLE "city" DROP CONSTRAINT "city_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
DROP COLUMN "provinceId",
ADD COLUMN     "provinceId" INTEGER NOT NULL,
ADD CONSTRAINT "city_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "province" DROP CONSTRAINT "province_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "province_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_address" DROP COLUMN "province",
ADD COLUMN     "province" INTEGER NOT NULL,
DROP COLUMN "city",
ADD COLUMN     "city" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_province_fkey" FOREIGN KEY ("province") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_city_fkey" FOREIGN KEY ("city") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "city_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
