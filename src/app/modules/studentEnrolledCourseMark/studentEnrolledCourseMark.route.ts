import express from "express";
import { StudentEnrolledCourseMarkController } from "./studentEnrolledCourseMark.controller";

const router = express.Router();

router
  .route("/")
  .get(StudentEnrolledCourseMarkController.getStudentMarks)
  .patch(StudentEnrolledCourseMarkController.updateStudentMarks);

router.patch(
  "/total-final",
  StudentEnrolledCourseMarkController.updateStudentTotalFinalMarks,
);

const studentEnrolledCourseMarkRouter = router;

export default studentEnrolledCourseMarkRouter;
