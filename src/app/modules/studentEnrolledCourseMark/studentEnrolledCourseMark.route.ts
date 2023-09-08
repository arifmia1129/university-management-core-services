import express from "express";
import { StudentEnrolledCourseMarkController } from "./studentEnrolledCourseMark.controller";

const router = express.Router();

router
  .route("/")
  .get(StudentEnrolledCourseMarkController.getStudentMarks)
  .patch(StudentEnrolledCourseMarkController.updateStudentMarks);

const studentEnrolledCourseMarkRouter = router;

export default studentEnrolledCourseMarkRouter;
