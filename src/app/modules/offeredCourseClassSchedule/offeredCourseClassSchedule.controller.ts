import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as offeredCourseClassScheduleService from "./offeredCourseClassSchedule.service";
import sendResponse from "../../../shared/sendResponse";
import { OfferedCourseClassSchedule } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { offeredCourseClassScheduleFilterableField } from "./offeredCourseClassSchedule.constant";

export const createOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await offeredCourseClassScheduleService.createOfferedCourseClassScheduleService(
        req.body,
      );
    sendResponse<OfferedCourseClassSchedule>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Successfully created Offered Course Class Schedule",
      data: result,
    });
  },
);

export const getAllOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const filters: Filter = pick(
      req.query,
      offeredCourseClassScheduleFilterableField,
    );
    const paginationOptions: Pagination = pick(req.query, paginationField);

    const result =
      await offeredCourseClassScheduleService.getAllofferedCourseClassScheduleService(
        filters,
        paginationOptions,
      );
    sendResponse<OfferedCourseClassSchedule[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created Offered Course Class Schedule",
      meta: result.meta,
      data: result.data,
    });
  },
);
export const getOfferedCourseClassScheduleById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await offeredCourseClassScheduleService.getOfferedCourseClassScheduleById(
        req.params.id,
      );
    sendResponse<OfferedCourseClassSchedule>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        "Successfully retrieved Offered Course Class Schedule information",
      data: result,
    });
  },
);
export const updateOfferedCourseClassScheduleById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await offeredCourseClassScheduleService.updateOfferedCourseClassScheduleById(
        req.params.id,
        req.body,
      );
    sendResponse<OfferedCourseClassSchedule>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated Offered Course Class Schedule information",
      data: result,
    });
  },
);
export const deleteOfferedCourseClassScheduleById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await offeredCourseClassScheduleService.deleteOfferedCourseClassScheduleById(
        req.params.id,
      );
    sendResponse<OfferedCourseClassSchedule>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted Offered Course Class Schedule information",
      data: result,
    });
  },
);
