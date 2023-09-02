import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import * as roomService from "./room.service";
import sendResponse from "../../../shared/sendResponse";
import { Room } from "@prisma/client";
import httpStatus from "../../../shared/httpStatus";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import { roomFilterableField } from "./room.constant";

export const createRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await roomService.createRoomService(req.body);
  sendResponse<Room>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully created Room",
    data: result,
  });
});

export const getAllRoom = catchAsync(async (req: Request, res: Response) => {
  const filters: Filter = pick(req.query, roomFilterableField);
  const paginationOptions: Pagination = pick(req.query, paginationField);

  const result = await roomService.getAllRoomService(
    filters,
    paginationOptions,
  );
  sendResponse<Room[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully created Room",
    meta: result.meta,
    data: result.data,
  });
});
export const getRoomById = catchAsync(async (req: Request, res: Response) => {
  const result = await roomService.getRoomById(req.params.id);
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully retrieved Room information",
    data: result,
  });
});
export const updateRoomById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await roomService.updateRoomById(req.params.id, req.body);
    sendResponse<Room>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated Room information",
      data: result,
    });
  },
);
export const deleteRoomById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await roomService.deleteRoomById(req.params.id);
    sendResponse<Room>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully deleted Room information",
      data: result,
    });
  },
);
