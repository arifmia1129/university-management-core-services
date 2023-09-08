import { Student, Prisma, StudentEnrolledCourse } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import { studentSearchableField } from "./student.constant";

export const createStudentService = async (
  semester: Student,
): Promise<Student> => {
  return await prisma.student.create({
    data: semester,
  });
};

export const getAllStudentService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<Student[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableField.map(field => ({
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

  const whereConditions: Prisma.StudentWhereInput = andConditions?.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.student.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.student.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getStudentById = async (id: string): Promise<Student> => {
  const res = await prisma.student.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic semester data by id", 404);
  }

  return res;
};
export const updateStudentById = async (
  id: string,
  data: Partial<Student>,
): Promise<Student> => {
  const res = await prisma.student.update({
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
export const deleteStudentById = async (id: string): Promise<Student> => {
  const res = await prisma.student.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete student data by id", 404);
  }

  return res;
};
export const myCourseService = async (
  studentId: string,
  filter: Filter,
): Promise<StudentEnrolledCourse[] | null> => {
  const semesterRegistration = await prisma.academicSemester.findFirst({
    where: {
      isCurrent: true,
    },
  });

  if (!filter.academicSemesterId) {
    filter.academicSemesterId = semesterRegistration?.id;
  }

  const res = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId,
      },
      ...filter,
    },
  });

  if (!res) {
    throw new ApiError("Failed to get student course", 404);
  }

  return res;
};
