import { Building, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import { buildingSearchableField } from "./buildting.constant";

export const createBuildingService = async (
  semester: Building,
): Promise<Building> => {
  return await prisma.building.create({
    data: semester,
  });
};

export const getAllBuildingService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<Building[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: buildingSearchableField.map(field => ({
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

  const whereConditions: Prisma.BuildingWhereInput = andConditions?.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.building.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.building.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getBuildingById = async (id: string): Promise<Building> => {
  const res = await prisma.building.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic semester data by id", 404);
  }

  return res;
};
export const updateBuildingById = async (
  id: string,
  data: Partial<Building>,
): Promise<Building> => {
  const res = await prisma.building.update({
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
export const deleteBuildingById = async (id: string): Promise<Building> => {
  const res = await prisma.building.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete Building data by id", 404);
  }

  return res;
};
