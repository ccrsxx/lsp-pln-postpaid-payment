-- DropForeignKey
ALTER TABLE "bill" DROP CONSTRAINT "bill_usage_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_user_id_fkey";

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_usage_id_fkey" FOREIGN KEY ("usage_id") REFERENCES "usage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;