/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseFaculty, Faculty, Prisma } from "@prisma/client";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiError";
import { facultySearchableField } from "./faculty.constant";
import { ICourseFaculty } from "./faculty.interface";
import httpStatus from "../../../shared/httpStatus";

export const createFacultyService = async (semester: any): Promise<Faculty> => {
  return await prisma.faculty.create({
    data: semester,
  });
};

export const getAllFacultyService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<Faculty[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableField.map(field => ({
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

  const whereConditions: Prisma.FacultyWhereInput = andConditions?.length
    ? { AND: andConditions }
    : {};

  const result = await prisma.faculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.faculty.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const getFacultyById = async (id: string): Promise<Faculty> => {
  const res = await prisma.faculty.findUnique({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to retrieved academic semester data by id", 404);
  }

  return res;
};
export const updateFacultyById = async (
  id: string,
  data: Partial<Faculty>,
): Promise<Faculty> => {
  const res = await prisma.faculty.update({
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
export const updateFacultyFromEvent = async (event: any): Promise<void> => {
  const info = {
    facultyId: event?.id,
    designation: event?.designation,
    firstName: event?.name?.firstName,
    lastName: event?.name?.lastName,
    middleName: event?.name?.middleName,
    profileImage: event?.profileImage,
    email: event?.email,
    contactNo: parseInt(event?.contactNo),
    gender: event?.gender,
    bloodGroup: event?.bloodGroup,
    academicDepartmentId: event?.academicDepartment?.syncId,
    academicFacultyId: event?.academicFaculty?.syncId,
  };

  const faculty = await prisma.faculty.findFirst({
    where: {
      facultyId: info.facultyId,
    },
  });

  await prisma.faculty.update({
    where: {
      id: faculty?.id,
    },
    data: info,
  });
};
export const deleteFacultyById = async (id: string): Promise<Faculty> => {
  const res = await prisma.faculty.delete({
    where: {
      id,
    },
  });

  if (!res) {
    throw new ApiError("Failed to delete Faculty data by id", 404);
  }

  return res;
};

export const assignCourseFacultyService = async (
  courseFacultyInfo: ICourseFaculty,
): Promise<void> => {
  const res = await prisma.courseFaculty.createMany({
    data: courseFacultyInfo.coursesId.map(id => ({
      facultyId: courseFacultyInfo.facultyId,
      courseId: id,
    })),
  });

  if (!res) {
    throw new ApiError(
      "Failed to create course faculty",
      httpStatus.BAD_REQUEST,
    );
  }
};
export const removeCourseFacultyService = async (
  courseFacultyInfo: ICourseFaculty,
): Promise<void> => {
  const res = await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: courseFacultyInfo.facultyId,
      courseId: {
        in: courseFacultyInfo.coursesId,
      },
    },
  });

  if (!res) {
    throw new ApiError(
      "Failed to delete course faculty",
      httpStatus.BAD_REQUEST,
    );
  }
};
export const getCourseFacultyService = async (): Promise<CourseFaculty[]> => {
  const res = await prisma.courseFaculty.findMany();

  if (!res) {
    throw new ApiError("Failed to get course faculty", httpStatus.BAD_REQUEST);
  }

  return res;
};
export const getMyCoursesService = async (
  facultyId: string,
  filters: Filter,
) => {
  if (!filters.academicSemesterId) {
    const semester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filters.academicSemesterId = semester?.id;
  }
  // console.log(filters);

  const offeredCourseSection = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filters.academicSemesterId as string,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: true,
    },
  });

  const facultiesCourses = offeredCourseSection.reduce((acc: any, obj: any) => {
    const course = obj.offeredCourse.course;
    const classSchedules = obj.offeredCourseClassSchedule;

    const existingCourse = acc.find(
      (item: any) => item.course.id === course.id,
    );

    if (existingCourse) {
      existingCourse.sections.push({
        section: obj,
        classSchedules,
      });
    } else {
      acc.push({
        course,
        sections: [
          {
            section: obj,
            classSchedules,
          },
        ],
      });
    }

    return acc;
  }, []);

  return facultiesCourses;
};

export const createFacultyFromEventService = async (event: any) => {
  const info: Partial<Faculty> = {
    facultyId: event?.id,
    designation: event?.designation,
    firstName: event?.name?.firstName,
    lastName: event?.name?.lastName,
    middleName: event?.name?.middleName,
    profileImage: event?.profileImage,
    email: event?.email,
    contactNo: parseInt(event?.contactNo),
    gender: event?.gender,
    bloodGroup: event?.bloodGroup,
    academicDepartmentId: event?.academicDepartment?.syncId,
    academicFacultyId: event?.academicFaculty?.syncId,
  };

  await createFacultyService(info);
};
