import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as buildingService from "./building.service";
import sendResponse from "../../../shared/sendResponse";
import { Building } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { buildingFilterableField } from "./buildting.constant";

export const createBuilding = catchAsync(
  async (req: Request, res: Response) => {
    const result = await buildingService.createBuildingService(req.body);
    sendResponse<Building>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Successfully created Building",
      data: result,
    });
  },
);

export const getAllBuilding = catchAsync(
  async (req: Request, res: Response) => {
    const filters: Filter = pick(req.query, buildingFilterableField);
    const paginationOptions: Pagination = pick(req.query, paginationField);

    const result = await buildingService.getAllBuildingService(
      filters,
      paginationOptions,
    );
    sendResponse<Building[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully created Building",
      meta: result.meta,
      data: result.data,
    });
  },
);
export const getBuildingById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await buildingService.getBuildingById(req.params.id);
    sendResponse<Building>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully retrieved Building information",
      data: result,
    });
  },
);
export const updateBuildingById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await buildingService.updateBuildingById(
      req.params.id,
      req.body,
    );
    sendResponse<Building>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated Building information",
      data: result,
    });
  },
);
export const deleteBuildingById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await buildingService.deleteBuildingById(req.params.id);
    sendResponse<Building>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted Building information",
      data: result,
    });
  },
);
