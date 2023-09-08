import { Prisma, StudentEnrolledCourse } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IStudentEnrolledCourse } from "./studentEnrolledCourse.interface";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { studentEnrolledCourseSearchableField } from "./studentEnrolledCourse.constant";
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";

const createEnrolledCourse = async (
  payload: IStudentEnrolledCourse,
): Promise<StudentEnrolledCourse | null> => {
  const isAlreadyExist = await prisma.studentEnrolledCourse.findFirst({
    where: {
      studentId: payload.studentId,
      courseId: payload.courseId,
      academicSemesterId: payload.academicSemesterId,
    },
  });
  let enrolledCourse = null;
  if (!isAlreadyExist) {
    enrolledCourse = await prisma.studentEnrolledCourse.create({
      data: {
        studentId: payload.studentId,
        courseId: payload.courseId,
        academicSemesterId: payload.academicSemesterId,
      },
    });
  }
  return enrolledCourse;
};

const getAllStudentEnrolledCourseService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<StudentEnrolledCourse[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: studentEnrolledCourseSearchableField.map(field => ({
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

  const whereConditions: Prisma.StudentEnrolledCourseWhereInput =
    andConditions?.length ? { AND: andConditions } : {};

  const result = await prisma.studentEnrolledCourse.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.studentEnrolledCourse.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

const getStudentEnrolledCourseByIdService = async (
  id: string,
): Promise<StudentEnrolledCourse> => {
  const res = await prisma.studentEnrolledCourse.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError(
      "Student enrolled course does not exist by id",
      httpStatus.NOT_FOUND,
    );
  }

  return res;
};
const updateStudentEnrolledCourseByIdService = async (
  id: string,
  data: Partial<StudentEnrolledCourse>,
): Promise<StudentEnrolledCourse> => {
  const res = await prisma.studentEnrolledCourse.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError(
      "Student enrolled course does not exist by id",
      httpStatus.NOT_FOUND,
    );
  }

  const updatedEnrolledCourse = await prisma.studentEnrolledCourse.update({
    where: { id },
    data,
  });

  return updatedEnrolledCourse;
};
const deleteStudentEnrolledCourseByIdService = async (
  id: string,
): Promise<StudentEnrolledCourse> => {
  const res = await prisma.studentEnrolledCourse.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError(
      "Student enrolled course does not exist by id",
      httpStatus.NOT_FOUND,
    );
  }

  const updatedEnrolledCourse = await prisma.studentEnrolledCourse.delete({
    where: { id },
  });

  return updatedEnrolledCourse;
};

export const studentEnrolledCourseService = {
  createEnrolledCourse,
  getAllStudentEnrolledCourseService,
  getStudentEnrolledCourseByIdService,
  updateStudentEnrolledCourseByIdService,
  deleteStudentEnrolledCourseByIdService,
};
