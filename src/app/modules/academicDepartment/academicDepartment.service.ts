import { AcademicDepartment, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { academicDepartmentSearchableField } from "./academicDepartment.constant";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";

export const createAcademicDepartmentService = async (
  Department: AcademicDepartment,
): Promise<AcademicDepartment> => {
  return await prisma.academicDepartment.create({
    data: Department,
  });
};

export const getAllAcademicDepartmentService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<AcademicDepartment[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: academicDepartmentSearchableField.map(field => ({
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

  const whereConditions: Prisma.AcademicDepartmentWhereInput =
    andConditions?.length ? { AND: andConditions } : {};

  const result = await prisma.academicDepartment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
    include: {
      AcademicFaculty: true,
    },
  });

  const total = await prisma.academicDepartment.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getAcademicDepartmentById = async (
  id: string,
): Promise<AcademicDepartment> => {
  const res = await prisma.academicDepartment.findUnique({
    where: {
      id,
    },
    include: {
      AcademicFaculty: true,
    },
  });

  if (!res) {
    throw new ApiError(
      "Failed to retrieved academic Department data by id",
      404,
    );
  }

  return res;
};
export const updateAcademicDepartmentById = async (
  id: string,
  data: Partial<AcademicDepartment>,
): Promise<AcademicDepartment> => {
  const res = await prisma.academicDepartment.update({
    data,
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to update academic Department data by id", 404);
  }

  return res;
};
export const deleteAcademicDepartmentById = async (
  id: string,
): Promise<AcademicDepartment> => {
  const res = await prisma.academicDepartment.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete academic Department data by id", 404);
  }

  return res;
};
