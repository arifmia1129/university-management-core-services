/*
  Warnings:

  - Made the column `status` on table `semester_registration` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "semester_registration" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'UPCOMING';
