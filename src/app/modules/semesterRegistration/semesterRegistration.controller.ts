import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as semesterRegistrationService from "./semesterRegistration.service";
import sendResponse from "../../../shared/sendResponse";
import { SemesterRegistration } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { semesterRegistrationFilterableField } from "./semesterRegistration.constant";

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
