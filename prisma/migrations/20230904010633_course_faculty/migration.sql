/*
  Warnings:

  - The primary key for the `CourseToPrerequisite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CourseToPrerequisite` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CourseToPrerequisite" DROP CONSTRAINT "CourseToPrerequisite_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CourseToPrerequisite_pkey" PRIMARY KEY ("courseId", "preRequisiteId");

-- CreateTable
CREATE TABLE "CourseFaculty" (
    "courseId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,

    CONSTRAINT "CourseFaculty_pkey" PRIMARY KEY ("courseId","facultyId")
);

-- AddForeignKey
ALTER TABLE "CourseFaculty" ADD CONSTRAINT "CourseFaculty_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseFaculty" ADD CONSTRAINT "CourseFaculty_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
