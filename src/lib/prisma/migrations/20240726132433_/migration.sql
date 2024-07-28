-- DropForeignKey
ALTER TABLE "usage" DROP CONSTRAINT "usage_user_id_fkey";

-- AddForeignKey
ALTER TABLE "usage" ADD CONSTRAINT "usage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
