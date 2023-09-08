import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { studentSemesterPaymentFilterableField } from "./studentSemesterPayment.constant";
import {
  Filter,
  Pagination,
} from "../../../interfaces/databaseQuery.interface";
import pick from "../../../shared/pick";
import { paginationField } from "../../constant/pagination";
import { StudentSemesterPaymentService } from "./studentSemesterPayment.service";
import { StudentSemesterPayment } from "@prisma/client";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "../../../shared/httpStatus";

const getAllStudentSemesterPayment = catchAsync(
  async (req: Request, res: Response) => {
    const filters: Filter = pick(
      req.query,
      studentSemesterPaymentFilterableField,
    );
    const paginationOptions: Pagination = pick(req.query, paginationField);

    const result =
      await StudentSemesterPaymentService.getAllStudentPaymentCourseService(
        filters,
        paginationOptions,
      );
    sendResponse<StudentSemesterPayment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully get all student semester payment",
      meta: result.meta,
      data: result.data,
    });
  },
);

export const StudentSemesterPaymentController = {
  getAllStudentSemesterPayment,
};
