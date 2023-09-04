import { OfferedCourseSection, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import { offeredCourseSectionSearchableField } from "./offeredCourseSection.constant";
import httpStatus from "../../../shared/httpStatus";

export const createOfferedCourseSectionService = async (
  payload: Omit<OfferedCourseSection, "semesterRegistrationId">,
): Promise<OfferedCourseSection> => {
  const isExist = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
  });

  if (!isExist) {
    throw new ApiError(
      "Offered course doesn't exist by giving id",
      httpStatus.NOT_FOUND,
    );
  }

  const updatedPayload: OfferedCourseSection = {
    ...payload,
    semesterRegistrationId: isExist.semesterRegistrationId,
  };

  return await prisma.offeredCourseSection.create({
    data: updatedPayload,
  });
};

export const getAllOfferedCourseSectionService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<OfferedCourseSection[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseSectionSearchableField.map(field => ({
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

  const whereConditions: Prisma.OfferedCourseSectionWhereInput =
    andConditions?.length ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseSection.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.offeredCourseSection.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getOfferedCourseSectionById = async (
  id: string,
): Promise<OfferedCourseSection> => {
  const res = await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic semester data by id", 404);
  }

  return res;
};
export const updateOfferedCourseSectionById = async (
  id: string,
  data: Partial<OfferedCourseSection>,
): Promise<OfferedCourseSection> => {
  const res = await prisma.offeredCourseSection.update({
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
export const deleteOfferedCourseSectionById = async (
  id: string,
): Promise<OfferedCourseSection> => {
  const res = await prisma.offeredCourseSection.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete OfferedCourseSection data by id", 404);
  }

  return res;
};
