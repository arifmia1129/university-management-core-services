import { ExamType, PrismaClient } from "@prisma/client";
import {
  DefaultArgs,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";
import prisma from "../../../shared/prisma";

export type CreateMark = {
  studentId: string;
  studentEnrolledCourseId: string;
  academicSemesterId: string;
};

export const createStudentEnrolledCourseMarkService = async (
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

const updateStudentMarksService = async (payload: any) => {
  console.log(payload);
};

export const studentEnrolledCourseMarkService = {
  updateStudentMarksService,
};
