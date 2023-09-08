import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { studentEnrolledCourseMarkService } from "./studentEnrolledCourseMark.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "../../../shared/httpStatus";
import { StudentEnrolledCourseMark } from "@prisma/client";

const updateStudentMarks = catchAsync(async (req: Request, res: Response) => {
  const result =
    await studentEnrolledCourseMarkService.updateStudentMarksService(req.body);
  sendResponse<StudentEnrolledCourseMark>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully updated student marks information",
    data: result,
  });
});

export const studentEnrolledCourseMarkController = {
  updateStudentMarks,
};
