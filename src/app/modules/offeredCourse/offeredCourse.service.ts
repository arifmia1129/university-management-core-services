import { OfferedCourse, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import { offeredCourseSearchableField } from "./offeredCourse.constant";
import { IOfferedCourse } from "./offeredCourse.interface";
import { asyncForEach } from "../../../shared/utils";

export const createOfferedCourseService = async (
  payload: IOfferedCourse,
): Promise<OfferedCourse[]> => {
  const { academicDepartmentId, semesterRegistrationId, courseIds } = payload;

  const result: OfferedCourse[] = [];

  await asyncForEach(courseIds, async (courseId: string) => {
    const isExist = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
    });

    if (!isExist) {
      const res = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
      });
      result.push(res);
    }
  });
  return result;
};

export const getAllOfferedCourseService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<OfferedCourse[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseSearchableField.map(field => ({
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

  const whereConditions: Prisma.OfferedCourseWhereInput = andConditions?.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.offeredCourse.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });

  const total = await prisma.offeredCourse.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getOfferedCourseByIdService = async (
  id: string,
): Promise<OfferedCourse> => {
  const res = await prisma.offeredCourse.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic semester data by id", 404);
  }

  return res;
};
export const updateOfferedCourseByIdService = async (
  id: string,
  data: Partial<OfferedCourse>,
): Promise<OfferedCourse> => {
  const res = await prisma.offeredCourse.update({
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
export const deleteOfferedCourseByIdService = async (
  id: string,
): Promise<OfferedCourse> => {
  const res = await prisma.offeredCourse.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete OfferedCourse data by id", 404);
  }

  return res;
};
