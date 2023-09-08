import express from "express";
import { studentEnrolledCourseController } from "./studentEnrolledCourse.controller";

const router = express.Router();

router.get("/", studentEnrolledCourseController.getAllStudentEnrolledCourse);

router
  .route("/:id")
  .get(studentEnrolledCourseController.getStudentEnrolledCourseById)
  .patch(studentEnrolledCourseController.updateStudentEnrolledCourseById)
  .delete(studentEnrolledCourseController.deleteStudentEnrolledCourseById);

const studentEnrolledCourseRouter = router;

export default studentEnrolledCourseRouter;
