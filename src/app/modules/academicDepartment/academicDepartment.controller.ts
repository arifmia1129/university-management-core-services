import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as academicDepartmentService from "./academicDepartment.service";
import sendResponse from "../../../shared/sendResponse";
import { AcademicDepartment } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { academicDepartmentFilterableField } from "./academicDepartment.constant";

export const createAcademicDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await academicDepartmentService.createAcademicDepartmentService(req.body);
    sendResponse<AcademicDepartment>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Successfully created academic Department",
      data: result,
    });
  },
);

export const getAllAcademicDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const filters: Filter = pick(req.query, academicDepartmentFilterableField);
    const paginationOptions: Pagination = pick(req.query, paginationField);

    const result =
      await academicDepartmentService.getAllAcademicDepartmentService(
        filters,
        paginationOptions,
      );
    sendResponse<AcademicDepartment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created academic Department",
      meta: result.meta,
      data: result.data,
    });
  },
);
export const getAcademicDepartmentById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await academicDepartmentService.getAcademicDepartmentById(
      req.params.id,
    );
    sendResponse<AcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved academic Department information",
      data: result,
    });
  },
);
export const updateAcademicDepartmentById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await academicDepartmentService.updateAcademicDepartmentById(
      req.params.id,
      req.body,
    );
    sendResponse<AcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated academic Department information",
      data: result,
    });
  },
);
export const deleteAcademicDepartmentById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await academicDepartmentService.deleteAcademicDepartmentById(
      req.params.id,
    );
    sendResponse<AcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted academic Department information",
      data: result,
    });
  },
);
