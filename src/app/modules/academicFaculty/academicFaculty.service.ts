import { AcademicFaculty, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { academicFacultySearchableField } from "./academicFaculty.constant";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";

export const createAcademicFacultyService = async (
  Faculty: AcademicFaculty,
): Promise<AcademicFaculty> => {
  return await prisma.academicFaculty.create({
    data: Faculty,
  });
};

export const getAllAcademicFacultyService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<AcademicFaculty[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: academicFacultySearchableField.map(field => ({
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

  const whereConditions: Prisma.AcademicFacultyWhereInput =
    andConditions?.length ? { AND: andConditions } : {};

  const result = await prisma.academicFaculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.academicFaculty.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getAcademicFacultyById = async (
  id: string,
): Promise<AcademicFaculty> => {
  const res = await prisma.academicFaculty.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic Faculty data by id", 404);
  }

  return res;
};
export const updateAcademicFacultyById = async (
  id: string,
  data: Partial<AcademicFaculty>,
): Promise<AcademicFaculty> => {
  const res = await prisma.academicFaculty.update({
    data,
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to update academic Faculty data by id", 404);
  }

  return res;
};
export const deleteAcademicFacultyById = async (
  id: string,
): Promise<AcademicFaculty> => {
  const res = await prisma.academicFaculty.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete academic Faculty data by id", 404);
  }

  return res;
};
