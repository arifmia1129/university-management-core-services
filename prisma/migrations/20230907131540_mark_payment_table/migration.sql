-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('MIDTERM', 'FINAL');

-- CreateEnum
CREATE TYPE "paymentStatus" AS ENUM ('PENDING', 'PARTIAL_PAID', 'FULL_PAIN');

-- CreateTable
CREATE TABLE "student_enrolled_course_mark" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentEnrolledCourseId" TEXT NOT NULL,
    "academicSemesterId" TEXT NOT NULL,
    "grade" TEXT,
    "marks" INTEGER NOT NULL DEFAULT 0,
    "examType" "ExamType",

    CONSTRAINT "student_enrolled_course_mark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_semester_payment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "academicSemesterId" TEXT NOT NULL,
    "fullPaymentAmount" INTEGER NOT NULL DEFAULT 0,
    "partialPaymentAmount" INTEGER NOT NULL DEFAULT 0,
    "totalPaidAmount" INTEGER NOT NULL DEFAULT 0,
    "paymentStatus" "paymentStatus" NOT NULL,

    CONSTRAINT "student_semester_payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_enrolled_course_mark" ADD CONSTRAINT "student_enrolled_course_mark_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_course_mark" ADD CONSTRAINT "student_enrolled_course_mark_studentEnrolledCourseId_fkey" FOREIGN KEY ("studentEnrolledCourseId") REFERENCES "student_enrolled_course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_enrolled_course_mark" ADD CONSTRAINT "student_enrolled_course_mark_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_payment" ADD CONSTRAINT "student_semester_payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_semester_payment" ADD CONSTRAINT "student_semester_payment_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semesters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
