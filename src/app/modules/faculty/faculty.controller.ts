import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as facultyService from "./faculty.service";
import sendResponse from "../../../shared/sendResponse";
import { Faculty } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { facultyFilterableField } from "./faculty.constant";

export const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await facultyService.createFacultyService(req.body);
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully created Faculty",
    data: result,
  });
});

export const getAllFaculty = catchAsync(async (req: Request, res: Response) => {
  const filters: Filter = pick(req.query, facultyFilterableField);
  const paginationOptions: Pagination = pick(req.query, paginationField);

  const result = await facultyService.getAllFacultyService(
    filters,
    paginationOptions,
  );
  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully created Faculty",
    meta: result.meta,
    data: result.data,
  });
});
export const getFacultyById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await facultyService.getFacultyById(req.params.id);
    sendResponse<Faculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved Faculty information",
      data: result,
    });
  },
);
export const updateFacultyById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await facultyService.updateFacultyById(
      req.params.id,
      req.body,
    );
    sendResponse<Faculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated Faculty information",
      data: result,
    });
  },
);
export const deleteFacultyById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await facultyService.deleteFacultyById(req.params.id);
    sendResponse<Faculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted Faculty information",
      data: result,
    });
  },
);
