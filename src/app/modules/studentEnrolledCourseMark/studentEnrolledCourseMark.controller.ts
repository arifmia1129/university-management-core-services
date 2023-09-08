import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "../../../shared/httpStatus";
import {
  StudentEnrolledCourse,
  StudentEnrolledCourseMark,
} from "@prisma/client";
import { StudentEnrolledCourseMarkService } from "./studentEnrolledCourseMark.service";

const getStudentMarks = catchAsync(async (req: Request, res: Response) => {
  const result =
    await StudentEnrolledCourseMarkService.getlAllStudentMarksService();
  sendResponse<StudentEnrolledCourseMark[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully get student marks information",
    data: result,
  });
});
const updateStudentMarks = catchAsync(async (req: Request, res: Response) => {
  const result =
    await StudentEnrolledCourseMarkService.updateStudentMarksService(req.body);
  sendResponse<StudentEnrolledCourseMark>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully updated student marks information",
    data: result,
  });
});
const updateStudentTotalFinalMarks = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseMarkService.updateStudentTotalFinalMarksService(
        req.body,
      );
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Successfully updated student total final marks information",
      data: result,
    });
  },
);

export const StudentEnrolledCourseMarkController = {
  updateStudentMarks,
  getStudentMarks,
  updateStudentTotalFinalMarks,
};
