import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as academicSemesterService from "./academicSemester.service";
import sendResponse from "../../../shared/sendResponse";
import { AcademicSemester } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";

export const createAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const result = await academicSemesterService.createAcademicSemesterService(
      req.body,
    );
    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created academic semester",
      data: result,
    });
  },
);

export const getAllAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await academicSemesterService.getAllAcademicSemesterService();
    sendResponse<AcademicSemester[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created academic semester",
      meta: result.meta,
      data: result.data,
    });
  },
);
