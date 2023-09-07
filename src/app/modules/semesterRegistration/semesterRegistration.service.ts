import {
  SemesterRegistration,
  Prisma,
  SemesterRegistrationStatus,
  StudentSemesterRegistrationCourse,
} from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import { semesterRegistrationSearchableField } from "./semesterRegistration.constant";
import httpStatus from "../../../shared/httpStatus";
import {
  ICourseEnrollRequest,
  IStudentSemesterRegistration,
} from "./semesterRegistration.interface";

export const createSemesterRegistrationService = async (
  semester: SemesterRegistration,
): Promise<SemesterRegistration> => {
  const isAlreadyRegistrationExist =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
        ],
      },
    });

  if (isAlreadyRegistrationExist) {
    throw new ApiError(
      `There is already registration ${isAlreadyRegistrationExist.status}`,
      httpStatus.BAD_REQUEST,
    );
  }

  return await prisma.semesterRegistration.create({
    data: semester,
  });
};

export const getAllSemesterRegistrationService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<SemesterRegistration[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: semesterRegistrationSearchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andConditions?.length ? { AND: andConditions } : {};

  const result = await prisma.semesterRegistration.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.semesterRegistration.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getSemesterRegistrationById = async (
  id: string,
): Promise<SemesterRegistration> => {
  const res = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic semester data by id", 404);
  }

  return res;
};
export const updateSemesterRegistrationById = async (
  id: string,
  data: Partial<SemesterRegistration>,
): Promise<SemesterRegistration> => {
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(
      "Semester registration is not exist by giving id",
      httpStatus.NOT_FOUND,
    );
  }

  if (
    data.status &&
    isExist.status === SemesterRegistrationStatus.UPCOMING &&
    data.status !== "ONGOING"
  ) {
    throw new ApiError(
      "Can only move status UNCOMING to ONGOING",
      httpStatus.BAD_REQUEST,
    );
  }
  if (
    data.status &&
    isExist.status === SemesterRegistrationStatus.ONGOING &&
    data.status !== "ENDED"
  ) {
    throw new ApiError(
      "Can only move status ONGOING to ENDED",
      httpStatus.BAD_REQUEST,
    );
  }
  const res = await prisma.semesterRegistration.update({
    data,
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to update academic semester data by id", 404);
  }

  return res;
};
export const deleteSemesterRegistrationById = async (
  id: string,
): Promise<SemesterRegistration> => {
  const res = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete SemesterRegistration data by id", 404);
  }

  return res;
};

export const studentSemesterRegistrationService = async (
  userId: string,
): Promise<IStudentSemesterRegistration> => {
  const isStudentExist = await prisma.student.findFirst({
    where: {
      studentId: userId,
    },
  });

  if (!isStudentExist) {
    throw new ApiError(
      "Failed to retrieved student information by id",
      httpStatus.NOT_FOUND,
    );
  }

  const isExistOngoingSemesterRegistration =
    await prisma.semesterRegistration.findFirst({
      where: {
        status: SemesterRegistrationStatus.ONGOING,
      },
    });

  if (!isExistOngoingSemesterRegistration) {
    throw new ApiError(
      "Semester registration is not yet started",
      httpStatus.BAD_REQUEST,
    );
  }

  let studentSemesterRegistration;

  studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        studentId: userId,
        semesterRegistrationId: isExistOngoingSemesterRegistration.id,
      },
    });

  if (!studentSemesterRegistration) {
    studentSemesterRegistration =
      await prisma.studentSemesterRegistration.create({
        data: {
          student: {
            connect: {
              id: isStudentExist.id,
            },
          },
          semesterRegistration: {
            connect: {
              id: isExistOngoingSemesterRegistration.id,
            },
          },
        },
      });
  }
  return {
    semesterRegistration: isExistOngoingSemesterRegistration,
    studentSemesterRegistration,
  };
};

export const enrollCourseService = async (
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
export const withdrewCourseService = async (
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
