import {
  SemesterRegistrationStatus,
  StudentSemesterRegistrationCourse,
} from "@prisma/client";
import { ICourseEnrollRequest } from "../semesterRegistration/semesterRegistration.interface";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";

const enrollCourseService = async (
  studentId: string,
  payload: ICourseEnrollRequest,
): Promise<StudentSemesterRegistrationCourse> => {
  const isStudentExist = await prisma.student.findFirst({
    where: {
      studentId,
    },
  });

  if (!isStudentExist) {
    throw new ApiError(
      "Student does not exist by given id",
      httpStatus.NOT_FOUND,
    );
  }

  const isSemesterRegistrationExist =
    await prisma.semesterRegistration.findFirst({
      where: {
        status: SemesterRegistrationStatus.ONGOING,
      },
    });

  if (!isSemesterRegistrationExist) {
    throw new ApiError(
      "Semester register is not running",
      httpStatus.BAD_REQUEST,
    );
  }

  const isOfferedCourseExist = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!isOfferedCourseExist) {
    throw new ApiError("Offered course not found", httpStatus.NOT_FOUND);
  }

  const isOfferedCourseSectionExist =
    await prisma.offeredCourseSection.findFirst({
      where: {
        id: payload.offeredCourseSectionId,
      },
    });

  if (!isOfferedCourseSectionExist) {
    throw new ApiError(
      "Offered course section not found",
      httpStatus.NOT_FOUND,
    );
  }

  if (
    isOfferedCourseSectionExist.currentlyEnrolledStudent >=
    isOfferedCourseSectionExist.maxCapacity
  ) {
    throw new ApiError(
      "Section capacity is already full.",
      httpStatus.BAD_REQUEST,
    );
  }

  const enrollProcess = await prisma.$transaction(async tx => {
    const res = await tx.studentSemesterRegistrationCourse.create({
      data: {
        studentId: isStudentExist.id,
        semesterRegistrationId: isSemesterRegistrationExist.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId,
      },
      include: {
        student: true,
        semesterRegistration: true,
        offeredCourse: true,
        offeredCourseSection: true,
      },
    });

    await tx.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });
    await tx.studentSemesterRegistration.updateMany({
      where: {
        studentId: isStudentExist.id,
        semesterRegistrationId: isSemesterRegistrationExist.id,
      },
      data: {
        totalCreditsTaken: {
          increment: isOfferedCourseExist.course.credits,
        },
      },
    });

    return res;
  });

  return enrollProcess;
};
const withdrewCourseService = async (
  studentId: string,
  payload: ICourseEnrollRequest,
): Promise<StudentSemesterRegistrationCourse> => {
  const isStudentExist = await prisma.student.findFirst({
    where: {
      studentId,
    },
  });

  if (!isStudentExist) {
    throw new ApiError(
      "Student does not exist by given id",
      httpStatus.NOT_FOUND,
    );
  }

  const isSemesterRegistrationExist =
    await prisma.semesterRegistration.findFirst({
      where: {
        status: SemesterRegistrationStatus.ONGOING,
      },
    });

  if (!isSemesterRegistrationExist) {
    throw new ApiError(
      "Semester register is not running",
      httpStatus.BAD_REQUEST,
    );
  }

  const isOfferedCourseExist = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!isOfferedCourseExist) {
    throw new ApiError("Offered course not found", httpStatus.NOT_FOUND);
  }

  const enrollProcess = await prisma.$transaction(async tx => {
    const res = await tx.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          semesterRegistrationId: isSemesterRegistrationExist.id,
          studentId: isStudentExist.id,
          offeredCourseId: payload.offeredCourseId,
        },
      },
      include: {
        student: true,
        semesterRegistration: true,
        offeredCourse: true,
        offeredCourseSection: true,
      },
    });

    await tx.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1,
        },
      },
    });
    await tx.studentSemesterRegistration.updateMany({
      where: {
        studentId: isStudentExist.id,
        semesterRegistrationId: isSemesterRegistrationExist.id,
      },
      data: {
        totalCreditsTaken: {
          decrement: isOfferedCourseExist.course.credits,
        },
      },
    });

    return res;
  });

  return enrollProcess;
};

export const studentSemesterRegistrationCourseService = {
  enrollCourseService,
  withdrewCourseService,
};
