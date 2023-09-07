import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as semesterRegistrationService from "./semesterRegistration.service";
import sendResponse from "../../../shared/sendResponse";
import {
  AcademicSemester,
  SemesterRegistration,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
} from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { semesterRegistrationFilterableField } from "./semesterRegistration.constant";
import { IStudentSemesterRegistration } from "./semesterRegistration.interface";

export const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await semesterRegistrationService.createSemesterRegistrationService(
        req.body,
      );
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Successfully created semester registration",
      data: result,
    });
  },
);

export const getAllSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const filters: Filter = pick(
      req.query,
      semesterRegistrationFilterableField,
    );
    const paginationOptions: Pagination = pick(req.query, paginationField);

    const result =
      await semesterRegistrationService.getAllSemesterRegistrationService(
        filters,
        paginationOptions,
      );
    sendResponse<SemesterRegistration[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created semester registration",
      meta: result.meta,
      data: result.data,
    });
  },
);
export const getSemesterRegistrationById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await semesterRegistrationService.getSemesterRegistrationById(
        req.params.id,
      );
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved semester registration information",
      data: result,
    });
  },
);
export const updateSemesterRegistrationById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await semesterRegistrationService.updateSemesterRegistrationById(
        req.params.id,
        req.body,
      );
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated semester registration information",
      data: result,
    });
  },
);
export const deleteSemesterRegistrationById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await semesterRegistrationService.deleteSemesterRegistrationById(
        req.params.id,
      );
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted semester registration information",
      data: result,
    });
  },
);
export const studentSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await semesterRegistrationService.studentSemesterRegistrationService(
        req?.user?.userId,
      );
    sendResponse<IStudentSemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully semester registration done",
      data: result,
    });
  },
);

export const studentSemesterRegistrationCourseEnroll = catchAsync(
  async (req: Request, res: Response) => {
    const result = await semesterRegistrationService.enrollCourseService(
      req?.user?.userId,
      req.body,
    );
    sendResponse<StudentSemesterRegistrationCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully enrolled course",
      data: result,
    });
  },
);
export const studentSemesterRegistrationCourseWithdrew = catchAsync(
  async (req: Request, res: Response) => {
    const result = await semesterRegistrationService.withdrewCourseService(
      req?.user?.userId,
      req.body,
    );
    sendResponse<StudentSemesterRegistrationCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully withdrewed course",
      data: result,
    });
  },
);
export const confirmRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await semesterRegistrationService.confirmRegistrationService(
      req?.user?.userId,
    );
    sendResponse<StudentSemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Congratulations! your registration is confirmed",
      data: result,
    });
  },
);
export const getRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await semesterRegistrationService.getRegistrationService(
      req?.user?.userId,
    );
    sendResponse<StudentSemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Registration data fetched",
      data: result,
    });
  },
);
export const startAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await semesterRegistrationService.startAcademicSemesterService(
        req?.params.id,
      );
    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Academic semester started",
      data: result,
    });
  },
);
