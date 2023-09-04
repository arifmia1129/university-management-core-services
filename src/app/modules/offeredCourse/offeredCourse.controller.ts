import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as offeredCourseService from "./offeredCourse.service";
import sendResponse from "../../../shared/sendResponse";
import { OfferedCourse } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { offeredCourseFilterableField } from "./offeredCourse.constant";

export const createOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const result = await offeredCourseService.createOfferedCourseService(
      req.body,
    );
    sendResponse<OfferedCourse[]>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Successfully created Offered Course",
      data: result,
    });
  },
);

export const getAllOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const filters: Filter = pick(req.query, offeredCourseFilterableField);
    const paginationOptions: Pagination = pick(req.query, paginationField);

    const result = await offeredCourseService.getAllOfferedCourseService(
      filters,
      paginationOptions,
    );
    sendResponse<OfferedCourse[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created Offered Course",
      meta: result.meta,
      data: result.data,
    });
  },
);
export const getOfferedCourseById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await offeredCourseService.getOfferedCourseByIdService(
      req.params.id,
    );
    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved Offered Course information",
      data: result,
    });
  },
);
export const updateOfferedCourseById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await offeredCourseService.updateOfferedCourseByIdService(
      req.params.id,
      req.body,
    );
    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated Offered Course information",
      data: result,
    });
  },
);
export const deleteOfferedCourseById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await offeredCourseService.deleteOfferedCourseByIdService(
      req.params.id,
    );
    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted OfferedCourse information",
      data: result,
    });
  },
);
