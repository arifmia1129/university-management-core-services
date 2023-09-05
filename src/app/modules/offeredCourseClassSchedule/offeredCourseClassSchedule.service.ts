import { OfferedCourseClassSchedule, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import {
  offeredCourseClassScheduleRelationalFieldsMapper,
  offeredCourseClassScheduleSearchableField,
  offeredCourseClassScheduleRelationalField,
} from "./offeredCourseClassSchedule.constant";
import * as classScheduleUtils from "./offeredCourseClassSchedule.utils";

export const createOfferedCourseClassScheduleService = async (
  data: OfferedCourseClassSchedule,
): Promise<OfferedCourseClassSchedule> => {
  await classScheduleUtils.checkRoomAvailablity(data);
  await classScheduleUtils.checkFacultyAvailablity(data);

  return await prisma.offeredCourseClassSchedule.create({
    data,
  });
};

export const getAllofferedCourseClassScheduleService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<OfferedCourseClassSchedule[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseClassScheduleSearchableField.map(field => ({
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

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (offeredCourseClassScheduleRelationalField.includes(key)) {
          return {
            [offeredCourseClassScheduleRelationalFieldsMapper[key]]: {
              id: filterData[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: filterData[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.OfferedCourseClassScheduleWhereInput =
    andConditions?.length ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseClassSchedule.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.offeredCourseClassSchedule.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getOfferedCourseClassScheduleById = async (
  id: string,
): Promise<OfferedCourseClassSchedule> => {
  const res = await prisma.offeredCourseClassSchedule.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError(
      "Failed to retrieved offered course class schedule by id",
      404,
    );
  }

  return res;
};
export const updateOfferedCourseClassScheduleById = async (
  id: string,
  data: Partial<OfferedCourseClassSchedule>,
): Promise<OfferedCourseClassSchedule> => {
  const res = await prisma.offeredCourseClassSchedule.update({
    data,
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError(
      "Failed to update offered course class schedule by id",
      404,
    );
  }

  return res;
};
export const deleteOfferedCourseClassScheduleById = async (
  id: string,
): Promise<OfferedCourseClassSchedule> => {
  const res = await prisma.offeredCourseClassSchedule.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError(
      "Failed to delete Offered Course ClassSchedule data by id",
      404,
    );
  }

  return res;
};
