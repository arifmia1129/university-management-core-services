import { AcademicSemester, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { academicSemesterSearchableField } from "./academicSemester.constant";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";

export const createAcademicSemesterService = async (
  semester: AcademicSemester,
): Promise<AcademicSemester> => {
  return await prisma.academicSemester.create({
    data: semester,
  });
};

export const getAllAcademicSemesterService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<AcademicSemester[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: academicSemesterSearchableField.map(field => ({
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

  const whereConditions: Prisma.AcademicSemesterWhereInput =
    andConditions?.length ? { AND: andConditions } : {};

  const result = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.academicSemester.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getAcademicSemesterById = async (
  id: string,
): Promise<AcademicSemester> => {
  const res = await prisma.academicSemester.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic semester data by id", 404);
  }

  return res;
};
