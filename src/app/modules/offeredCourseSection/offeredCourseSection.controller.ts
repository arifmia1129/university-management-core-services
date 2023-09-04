import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as offeredCourseSectionService from "./offeredCourseSection.service";
import sendResponse from "../../../shared/sendResponse";
import { OfferedCourseSection } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { offeredCourseSectionFilterableField } from "./offeredCourseSection.constant";

export const createOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await offeredCourseSectionService.createOfferedCourseSectionService(
        req.body,
      );
    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Successfully created OfferedCourseSection",
      data: result,
    });
  },
);

export const getAllOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const filters: Filter = pick(
      req.query,
      offeredCourseSectionFilterableField,
    );
    const paginationOptions: Pagination = pick(req.query, paginationField);

    const result =
      await offeredCourseSectionService.getAllOfferedCourseSectionService(
        filters,
        paginationOptions,
      );
    sendResponse<OfferedCourseSection[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created OfferedCourseSection",
      meta: result.meta,
      data: result.data,
    });
  },
);
export const getOfferedCourseSectionById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await offeredCourseSectionService.getOfferedCourseSectionById(
        req.params.id,
      );
    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved OfferedCourseSection information",
      data: result,
    });
  },
);
export const updateOfferedCourseSectionById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await offeredCourseSectionService.updateOfferedCourseSectionById(
        req.params.id,
        req.body,
      );
    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated OfferedCourseSection information",
      data: result,
    });
  },
);
export const deleteOfferedCourseSectionById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await offeredCourseSectionService.deleteOfferedCourseSectionById(
        req.params.id,
      );
    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted OfferedCourseSection information",
      data: result,
    });
  },
);
