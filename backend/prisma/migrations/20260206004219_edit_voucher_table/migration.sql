/*
  Warnings:

  - You are about to drop the column `voucher_id` on the `user_voucher` table. All the data in the column will be lost.
  - Added the required column `voucher_code` to the `user_voucher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_voucher" DROP CONSTRAINT "user_voucher_voucher_id_fkey";

-- AlterTable
ALTER TABLE "user_voucher" DROP COLUMN "voucher_id",
ADD COLUMN     "voucher_code" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "user_voucher" ADD CONSTRAINT "user_voucher_voucher_code_fkey" FOREIGN KEY ("voucher_code") REFERENCES "voucher"("voucher_code") ON DELETE RESTRICT ON UPDATE CASCADE;
