import express from "express";
import { studentEnrolledCourseMarkController } from "./studentEnrolledCourseMark.controller";

const router = express.Router();

router
  .route("/")

  .patch(studentEnrolledCourseMarkController.updateStudentMarks);

const studentEnrolledCourseMarkRouter = router;

export default studentEnrolledCourseMarkRouter;
