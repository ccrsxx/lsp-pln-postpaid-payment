-- DropForeignKey
ALTER TABLE "bill" DROP CONSTRAINT "bill_user_id_fkey";

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
