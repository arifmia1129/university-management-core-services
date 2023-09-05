import { OfferedCourseClassSchedule } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { hasTimeConflict } from "../../../shared/utils";
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";

export const checkRoomAvailablity = async (
  data: OfferedCourseClassSchedule,
) => {
  const existingSlots = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: data.dayOfWeek,
      roomId: data.roomId,
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
  };

  if (hasTimeConflict(existingSlots, newSlot)) {
    throw new ApiError(
      "Room is already book for another class",
      httpStatus.CONFLICT,
    );
  }
};
export const checkFacultyAvailablity = async (
  data: OfferedCourseClassSchedule,
) => {
  const existingSlots = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: data.dayOfWeek,
      facultyId: data.facultyId,
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
  };

  if (hasTimeConflict(existingSlots, newSlot)) {
    throw new ApiError(
      "Faculty is already assigned for another class",
      httpStatus.CONFLICT,
    );
  }
};
