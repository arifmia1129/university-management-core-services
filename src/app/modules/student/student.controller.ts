import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as studentService from "./student.service";
import sendResponse from "../../../shared/sendResponse";
import {
  Student,
  StudentEnrolledCourse,
  StudentSemesterRegistration,
} from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import {
  studentCourseFilterableField,
  studentFilterableField,
} from "./student.constant";

export const createStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await studentService.createStudentService(req.body);
  sendResponse<Student>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully created student",
    data: result,
  });
});

export const getAllStudent = catchAsync(async (req: Request, res: Response) => {
  const filters: Filter = pick(req.query, studentFilterableField);
  const paginationOptions: Pagination = pick(req.query, paginationField);

  const result = await studentService.getAllStudentService(
    filters,
    paginationOptions,
  );
  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully created student",
    meta: result.meta,
    data: result.data,
  });
});
export const getStudentById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await studentService.getStudentById(req.params.id);
    sendResponse<Student>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved student information",
      data: result,
    });
  },
);
export const updateStudentById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await studentService.updateStudentById(
      req.params.id,
      req.body,
    );
    sendResponse<Student>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated student information",
      data: result,
    });
  },
);
export const deleteStudentById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await studentService.deleteStudentById(req.params.id);
    sendResponse<Student>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted student information",
      data: result,
    });
  },
);
export const myCourse = catchAsync(async (req: Request, res: Response) => {
  const filters: Filter = pick(req.query, studentCourseFilterableField);
  const result = await studentService.myCourseService(
    req?.user?.studentId,
    filters,
  );
  sendResponse<StudentEnrolledCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully get student courses",
    data: result,
  });
});
export const myCourseClassScheduels = catchAsync(
  async (req: Request, res: Response) => {
    const filters: Filter = pick(req.query, studentCourseFilterableField);
    const result = await studentService.myCourseScheduelService(
      req?.user?.studentId,
      filters,
    );
    sendResponse<StudentSemesterRegistration[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully get student courses",
      data: result,
    });
  },
);
export const myAcademicInfo = catchAsync(
  async (req: Request, res: Response) => {
    const result = await studentService.myAcademicInfoService(
      req?.user?.studentId,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully get student courses",
      data: result,
    });
  },
);
