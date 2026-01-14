/*
  Warnings:

  - A unique constraint covering the columns `[store_id]` on the table `store_admins` will be added. If there are existing duplicate values, this will fail.
  - Made the column `address` on table `stores` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "stores" ALTER COLUMN "address" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "store_admins_store_id_key" ON "store_admins"("store_id");
