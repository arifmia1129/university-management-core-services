import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import pick from "../../../shared/pick";
import { studentEnrolledCourseFilterableField } from "./studentEnrolledCourse.constant";
import { paginationField } from "../../constant/pagination";
import { studentEnrolledCourseService } from "./studentEnrolledCourse.service";
import sendResponse from "../../../shared/sendResponse";
import { StudentEnrolledCourse } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";

const getAllStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    const filters: Filter = pick(
      req.query,
      studentEnrolledCourseFilterableField,
    );
    const paginationOptions: Pagination = pick(req.query, paginationField);

    const result =
      await studentEnrolledCourseService.getAllStudentEnrolledCourseService(
        filters,
        paginationOptions,
      );
    sendResponse<StudentEnrolledCourse[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully get all student enrolled courses",
      meta: result.meta,
      data: result.data,
    });
  },
);
const getStudentEnrolledCourseById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await studentEnrolledCourseService.getStudentEnrolledCourseByIdService(
        req.params.id,
      );
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully get student enrolled courses by id",
      data: result,
    });
  },
);
const updateStudentEnrolledCourseById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await studentEnrolledCourseService.updateStudentEnrolledCourseByIdService(
        req.params.id,
        req.body,
      );
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated student enrolled courses by id",
      data: result,
    });
  },
);
const deleteStudentEnrolledCourseById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await studentEnrolledCourseService.deleteStudentEnrolledCourseByIdService(
        req.params.id,
      );
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted student enrolled courses by id",
      data: result,
    });
  },
);

export const studentEnrolledCourseController = {
  getAllStudentEnrolledCourse,
  getStudentEnrolledCourseById,
  updateStudentEnrolledCourseById,
  deleteStudentEnrolledCourseById,
};
