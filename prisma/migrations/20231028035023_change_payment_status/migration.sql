/*
  Warnings:

  - The values [FULL_PAIN] on the enum `paymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "paymentStatus_new" AS ENUM ('PENDING', 'PARTIAL_PAID', 'FULL_PAID');
ALTER TABLE "student_semester_payment" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "student_semester_payment" ALTER COLUMN "paymentStatus" TYPE "paymentStatus_new" USING ("paymentStatus"::text::"paymentStatus_new");
ALTER TYPE "paymentStatus" RENAME TO "paymentStatus_old";
ALTER TYPE "paymentStatus_new" RENAME TO "paymentStatus";
DROP TYPE "paymentStatus_old";
ALTER TABLE "student_semester_payment" ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';
COMMIT;
