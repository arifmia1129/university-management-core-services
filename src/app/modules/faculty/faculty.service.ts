import { Faculty, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import { facultySearchableField } from "./faculty.constant";

export const createFacultyService = async (
  semester: Faculty,
): Promise<Faculty> => {
  return await prisma.faculty.create({
    data: semester,
  });
};

export const getAllFacultyService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<Faculty[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableField.map(field => ({
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

  const whereConditions: Prisma.FacultyWhereInput = andConditions?.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.faculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.faculty.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getFacultyById = async (id: string): Promise<Faculty> => {
  const res = await prisma.faculty.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic semester data by id", 404);
  }

  return res;
};
export const updateFacultyById = async (
  id: string,
  data: Partial<Faculty>,
): Promise<Faculty> => {
  const res = await prisma.faculty.update({
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
export const deleteFacultyById = async (id: string): Promise<Faculty> => {
  const res = await prisma.faculty.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete Faculty data by id", 404);
  }

  return res;
};