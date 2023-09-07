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
import { studentSemesterRegistrationCourseService } from "../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service";

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
  return await studentSemesterRegistrationCourseService.enrollCourseService(
    studentId,
    payload,
  );
};
export const withdrewCourseService = async (
  studentId: string,
  payload: ICourseEnrollRequest,
): Promise<StudentSemesterRegistrationCourse> => {
  return await studentSemesterRegistrationCourseService.withdrewCourseService(
    studentId,
    payload,
  );
};
