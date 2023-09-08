import { StudentEnrolledCourseStatus } from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";
import prisma from "../../../shared/prisma";

export function calculateResult(totalMarks: number) {
  if (totalMarks < 0 || totalMarks > 100) {
    throw new ApiError(
      "Invalid input: Total marks should be between 0 and 100.",
      httpStatus.BAD_REQUEST,
    );
  }

  let result;

  if (totalMarks >= 80) {
    result = {
      grade: "A+",
      point: 4.0,
    };
  } else if (totalMarks >= 70) {
    return (result = {
      grade: "A",
      point: 3.5,
    });
  } else if (totalMarks >= 60) {
    return (result = {
      grade: "B",
      point: 3.0,
    });
  } else if (totalMarks >= 50) {
    result = {
      grade: "C",
      point: 2.0,
    };
  } else if (totalMarks >= 40) {
    result = {
      grade: "D",
      point: 1.0,
    };
  } else {
    result = {
      grade: "F",
      point: 0,
    };
  }

  return result;
}

export const calculateAcademicInfoResult = async (studentId: string) => {
  const isCompleteEnrolledCourseExist =
    await prisma.studentEnrolledCourse.findMany({
      where: {
        studentId,
        status: StudentEnrolledCourseStatus.COMPLETED,
      },
      include: {
        course: true,
      },
    });

  if (isCompleteEnrolledCourseExist) {
    let totalCGPA = 0;
    let totalCredit = 0;

    for (const course of isCompleteEnrolledCourseExist) {
      totalCGPA += course.point;
      totalCredit += course.course.credits;
    }
    const avgCGPA = Number(
      (totalCGPA / isCompleteEnrolledCourseExist.length).toFixed(2),
    );

    return {
      totalCompletedCredit: totalCredit,
      cgpa: avgCGPA,
    };
  } else {
    return {
      totalCompletedCredit: 0,
      cgpa: 0,
    };
  }
};
