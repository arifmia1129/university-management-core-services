import {
  OfferedCourseClassSchedule,
  OfferedCourseClassScheduleDayOfWeek,
  OfferedCourseSection,
  Prisma,
} from "@prisma/client";
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
import { asyncForEach } from "../../../shared/utils";
import {
  checkFacultyAvailablity,
  checkRoomAvailablity,
} from "../offeredCourseClassSchedule/offeredCourseClassSchedule.utils";

export type Schedule = {
  startTime: string;
  endTime: string;
  dayOfWeek: OfferedCourseClassScheduleDayOfWeek;
  roomId: string;
  facultyId: string;
};

type Payload = Omit<OfferedCourseSection, "semesterRegistrationId"> & {
  classSchedules: Schedule[];
};

export const createOfferedCourseSectionService = async (
  payload: Payload,
): Promise<OfferedCourseSection> => {
  const { classSchedules, ...offeredCourseData } = payload;

  // console.log(payload);

  const isExist = await prisma.offeredCourse.findFirst({
    where: {
      id: offeredCourseData.offeredCourseId,
    },
  });

  if (!isExist) {
    throw new ApiError(
      "Offered course doesn't exist by giving id",
      httpStatus.NOT_FOUND,
    );
  }

  const isSectionAlreadyExist = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourseId: offeredCourseData.offeredCourseId,
      title: offeredCourseData.title,
    },
  });

  if (isSectionAlreadyExist) {
    throw new ApiError(
      "Offered course section is alreay exist",
      httpStatus.BAD_REQUEST,
    );
  }

  asyncForEach(classSchedules, async (schedule: OfferedCourseClassSchedule) => {
    await checkRoomAvailablity(schedule);
    await checkFacultyAvailablity(schedule);
  });

  const updatedPayload: OfferedCourseSection = {
    ...offeredCourseData,
    semesterRegistrationId: isExist.semesterRegistrationId,
  };
  const offeredCourse = await prisma.$transaction(async tx => {
    const section = await tx.offeredCourseSection.create({
      data: updatedPayload,
    });

    const schedulesData = classSchedules.map(schedule => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
      roomId: schedule.roomId,
      facultyId: schedule.facultyId,
      offeredCourseSectionId: section.id,
      semesterRegistrationId: isExist.semesterRegistrationId,
    }));

    await tx.offeredCourseClassSchedule.createMany({
      data: schedulesData,
    });

    return section;
  });

  return offeredCourse;
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
