-- DropForeignKey
ALTER TABLE "bill" DROP CONSTRAINT "bill_usage_id_fkey";

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_usage_id_fkey" FOREIGN KEY ("usage_id") REFERENCES "usage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
