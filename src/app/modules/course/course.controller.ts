import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as CourseService from "./course.service";
import sendResponse from "../../../shared/sendResponse";
import { Course, CourseFaculty } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { courseFilterableField } from "./course.constant";

export const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourseService(req.body);
  sendResponse<Course>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully created Course",
    data: result,
  });
});

export const getAllCourse = catchAsync(async (req: Request, res: Response) => {
  const filters: Filter = pick(req.query, courseFilterableField);
  const paginationOptions: Pagination = pick(req.query, paginationField);

  const result = await CourseService.getAllCourseService(
    filters,
    paginationOptions,
  );
  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully created Course",
    meta: result.meta,
    data: result.data,
  });
});
export const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getCourseById(req.params.id);
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully retrieved Course information",
    data: result,
  });
});
export const updateCourseById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CourseService.updateCourseById(
      req.params.id,
      req.body,
    );
    sendResponse<Course>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated Course information",
      data: result,
    });
  },
);
export const deleteCourseById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CourseService.deleteCourseById(req.params.id);
    sendResponse<Course>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted Course information",
      data: result,
    });
  },
);
export const assignCourseFaculty = catchAsync(
  async (req: Request, res: Response) => {
    await CourseService.assignCourseFacultyService(req.body);
    sendResponse<CourseFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully assigned course faculties",
    });
  },
);
export const getCourseFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const result = await CourseService.getCourseFacultyService();
    sendResponse<CourseFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully get course faculties",
      data: result,
    });
  },
);
