-- AlterTable
ALTER TABLE "user_voucher" ALTER COLUMN "used_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "voucher" ALTER COLUMN "end_date" DROP NOT NULL,
ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "stock" DROP NOT NULL;
