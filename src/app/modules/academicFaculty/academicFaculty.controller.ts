import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as academicFacultyService from "./academicFaculty.service";
import sendResponse from "../../../shared/sendResponse";
import { AcademicFaculty } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { academicFacultyFilterableField } from "./academicFaculty.constant";

export const createAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const result = await academicFacultyService.createAcademicFacultyService(
      req.body,
    );
    sendResponse<AcademicFaculty>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Successfully created academic Faculty",
      data: result,
    });
  },
);

export const getAllAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const filters: Filter = pick(req.query, academicFacultyFilterableField);
    const paginationOptions: Pagination = pick(req.query, paginationField);

    const result = await academicFacultyService.getAllAcademicFacultyService(
      filters,
      paginationOptions,
    );
    sendResponse<AcademicFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created academic Faculty",
      meta: result.meta,
      data: result.data,
    });
  },
);
export const getAcademicFacultyById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await academicFacultyService.getAcademicFacultyById(
      req.params.id,
    );
    sendResponse<AcademicFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved academic Faculty information",
      data: result,
    });
  },
);
export const updateAcademicFacultyById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await academicFacultyService.updateAcademicFacultyById(
      req.params.id,
      req.body,
    );
    sendResponse<AcademicFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated academic Faculty information",
      data: result,
    });
  },
);
export const deleteAcademicFacultyById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await academicFacultyService.deleteAcademicFacultyById(
      req.params.id,
    );
    sendResponse<AcademicFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted academic Faculty information",
      data: result,
    });
  },
);
