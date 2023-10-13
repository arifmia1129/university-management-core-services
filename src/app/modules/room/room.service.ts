import { Room, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import { roomSearchableField } from "./room.constant";

export const createRoomService = async (semester: Room): Promise<Room> => {
  return await prisma.room.create({
    data: semester,
  });
};

export const getAllRoomService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<Room[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: roomSearchableField.map(field => ({
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

  const whereConditions: Prisma.RoomWhereInput = andConditions?.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.room.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      building: true,
    },
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.room.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getRoomById = async (id: string): Promise<Room> => {
  const res = await prisma.room.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic semester data by id", 404);
  }

  return res;
};
export const updateRoomById = async (
  id: string,
  data: Partial<Room>,
): Promise<Room> => {
  const res = await prisma.room.update({
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
export const deleteRoomById = async (id: string): Promise<Room> => {
  const res = await prisma.room.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete Room data by id", 404);
  }

  return res;
};
