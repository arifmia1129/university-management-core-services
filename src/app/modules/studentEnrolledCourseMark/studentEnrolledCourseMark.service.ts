import {
  ExamType,
  PrismaClient,
  StudentEnrolledCourse,
  StudentEnrolledCourseMark,
  StudentEnrolledCourseStatus,
} from "@prisma/client";
import {
  DefaultArgs,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";
import {
  calculateAcademicInfoResult,
  calculateResult,
} from "./studentEnrolledCourseMark.utils";

export type CreateMark = {
  studentId: string;
  studentEnrolledCourseId: string;
  academicSemesterId: string;
};

const createStudentEnrolledCourseMarkService = async (
  tx: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  payload: CreateMark,
) => {
  const isMidMarkExist = await prisma.studentEnrolledCourseMark.findFirst({
    where: {
      academicSemesterId: payload.academicSemesterId,
      studentId: payload.studentId,
      studentEnrolledCourseId: payload.studentEnrolledCourseId,
      examType: ExamType.MIDTERM,
    },
  });

  if (!isMidMarkExist) {
    await prisma.studentEnrolledCourseMark.create({
      data: {
        academicSemesterId: payload.academicSemesterId,
        studentId: payload.studentId,
        studentEnrolledCourseId: payload.studentEnrolledCourseId,
        examType: ExamType.MIDTERM,
      },
    });
  }

  const isFinalMarkExist = await prisma.studentEnrolledCourseMark.findFirst({
    where: {
      academicSemesterId: payload.academicSemesterId,
      studentId: payload.studentId,
      studentEnrolledCourseId: payload.studentEnrolledCourseId,
      examType: ExamType.FINAL,
    },
  });

  if (!isFinalMarkExist) {
    await prisma.studentEnrolledCourseMark.create({
      data: {
        academicSemesterId: payload.academicSemesterId,
        studentId: payload.studentId,
        studentEnrolledCourseId: payload.studentEnrolledCourseId,
        examType: ExamType.FINAL,
      },
    });
  }
};

const getlAllStudentMarksService = async (): Promise<
  StudentEnrolledCourseMark[]
> => {
  return await prisma.studentEnrolledCourseMark.findMany({
    include: {
      studentEnrolledCourse: true,
      acaedemicSemester: true,
      student: true,
    },
  });
};

const updateStudentMarksService = async (payload: {
  studentId: string;
  academicSemesterId: string;
  courseId: string;
  examType: ExamType;
  marks: number;
}) => {
  const { studentId, academicSemesterId, courseId, examType, marks } = payload;

  const isExist = await prisma.studentEnrolledCourseMark.findFirst({
    where: {
      examType,
      studentId,
      academicSemesterId,
      studentEnrolledCourse: {
        courseId,
      },
    },
    include: {
      studentEnrolledCourse: {
        include: {
          StudentEnrolledCourseMark: true,
        },
      },
      acaedemicSemester: true,
    },
  });

  if (!isExist) {
    throw new ApiError(
      "Student enrolled course marks not found",
      httpStatus.NOT_FOUND,
    );
  }

  const result = calculateResult(marks);

  return await prisma.studentEnrolledCourseMark.update({
    where: {
      id: isExist.id,
    },
    data: {
      grade: result.grade,
      marks,
    },
    include: {
      acaedemicSemester: true,
      student: true,
      studentEnrolledCourse: true,
    },
  });
};
const updateStudentTotalFinalMarksService = async (payload: {
  studentId: string;
  academicSemesterId: string;
  courseId: string;
}): Promise<StudentEnrolledCourse> => {
  const { studentId, academicSemesterId, courseId } = payload;

  const isExist = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      studentId,
      academicSemesterId,
      studentEnrolledCourse: {
        courseId,
      },
    },
  });

  if (!isExist.length) {
    throw new ApiError(
      "Student enrolled course marks not found",
      httpStatus.NOT_FOUND,
    );
  }

  const midTermMarks =
    isExist.find(item => item.examType === ExamType.MIDTERM)?.marks || 0;
  const finalTermMarks =
    isExist.find(item => item.examType === ExamType.FINAL)?.marks || 0;

  const marks = Math.ceil(midTermMarks * 0.4) + Math.ceil(finalTermMarks * 0.6);

  const result = calculateResult(marks);

  const isStudentEnrolledCourseExist =
    await prisma.studentEnrolledCourse.findFirst({
      where: {
        studentId,
        courseId,
        academicSemesterId,
      },
    });

  if (!isStudentEnrolledCourseExist) {
    throw new ApiError(
      "Student enrolled course not found",
      httpStatus.NOT_FOUND,
    );
  }

  const res = await prisma.studentEnrolledCourse.update({
    where: {
      id: isStudentEnrolledCourseExist.id,
    },
    data: {
      grade: result.grade,
      point: result.point,
      totalMarks: marks,
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
  });
  const academicResult = await calculateAcademicInfoResult(studentId);

  const isStudentAcademicInfoExist = await prisma.studentAcademicInfo.findFirst(
    {
      where: {
        studentId,
      },
    },
  );

  if (!isStudentAcademicInfoExist) {
    await prisma.studentAcademicInfo.create({
      data: {
        studentId,
        totalCompletedCredit: academicResult.totalCompletedCredit,
        cgpa: academicResult.cgpa,
      },
    });
  } else {
    await prisma.studentAcademicInfo.update({
      where: {
        id: isStudentAcademicInfoExist.id,
      },
      data: {
        totalCompletedCredit: academicResult.totalCompletedCredit,
        cgpa: academicResult.cgpa,
      },
    });
  }

  return res;
};

export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseMarkService,
  updateStudentMarksService,
  getlAllStudentMarksService,
  updateStudentTotalFinalMarksService,
};
