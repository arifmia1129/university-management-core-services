import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as academicSemesterService from "./academicSemester.service";
import sendResponse from "../../../shared/sendResponse";
import { AcademicSemester } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { academicSemesterFilterableField } from "./academicSemester.constant";

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
    const filters: Filter = pick(req.query, academicSemesterFilterableField);
    const paginationOptions: Pagination = pick(req.query, paginationField);

    const result = await academicSemesterService.getAllAcademicSemesterService(
      filters,
      paginationOptions,
    );
    sendResponse<AcademicSemester[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created academic semester",
      meta: result.meta,
      data: result.data,
    });
  },
);
export const getAcademicSemesterById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await academicSemesterService.getAcademicSemesterById(
      req.params.id,
    );
    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved academic semester information",
      data: result,
    });
  },
);
