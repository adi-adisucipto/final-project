/*
  Warnings:

  - You are about to drop the column `voucher_name` on the `voucher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voucher_code]` on the table `voucher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end_date` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voucher_code` to the `voucher` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `discount_type` on the `voucher` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "voucher_voucher_name_key";

-- AlterTable
ALTER TABLE "voucher" DROP COLUMN "voucher_name",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "product_id" TEXT,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "stock" INTEGER NOT NULL,
ADD COLUMN     "store_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "voucher_code" TEXT NOT NULL,
DROP COLUMN "discount_type",
ADD COLUMN     "discount_type" "DiscountType" NOT NULL,
ALTER COLUMN "max_discount" DROP NOT NULL,
ALTER COLUMN "min_purchase" DROP NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "voucher_voucher_code_key" ON "voucher"("voucher_code");

-- AddForeignKey
ALTER TABLE "voucher" ADD CONSTRAINT "voucher_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher" ADD CONSTRAINT "voucher_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
