import { Course, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import { courseSearchableField } from "./course.constant";
import { ICreateCourse } from "./course.interface";

export const createCourseService = async (
  course: ICreateCourse,
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = course;

  const newCourse = await prisma.$transaction(async tx => {
    const res = await tx.course.create({
      data: courseData,
    });

    if (!res) {
      throw new ApiError("Failed to create course", 400);
    }

    for (const preRequisiteCourse of preRequisiteCourses) {
      await tx.courseToPrerequisite.create({
        data: {
          courseId: res.id,
          preRequisiteId: preRequisiteCourse.courseId,
        },
      });
    }

    return res;
  });

  if (newCourse) {
    return await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequsite: {
          include: {
            preRequisite: true,
          },
        },
      },
    });
  } else {
    throw new ApiError("Failed to create a course", 400);
  }
};

export const getAllCourseService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<Course[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: courseSearchableField.map(field => ({
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

  const whereConditions: Prisma.CourseWhereInput = andConditions?.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.course.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.course.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getCourseById = async (id: string): Promise<Course> => {
  const res = await prisma.course.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic semester data by id", 404);
  }

  return res;
};
export const updateCourseById = async (
  id: string,
  data: Partial<Course>,
): Promise<Course> => {
  const res = await prisma.course.update({
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
export const deleteCourseById = async (id: string): Promise<Course> => {
  const res = await prisma.course.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete Course data by id", 404);
  }

  return res;
};
