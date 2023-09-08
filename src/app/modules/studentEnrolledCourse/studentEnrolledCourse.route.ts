import express from "express";
import { studentEnrolledCourseController } from "./studentEnrolledCourse.controller";
import { StudentEnrolledCourseValidation } from "./studentEnrolledCourse.validation";
import requestValidator from "../../middleware/requestValidator";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", studentEnrolledCourseController.getAllStudentEnrolledCourse);

router
  .route("/:id")
  .all(auth(USER_ROLE_ENUM.FACULTY))
  .get(studentEnrolledCourseController.getStudentEnrolledCourseById)
  .patch(
    requestValidator(StudentEnrolledCourseValidation.updateCourseValidation),
    studentEnrolledCourseController.updateStudentEnrolledCourseById,
  )
  .delete(studentEnrolledCourseController.deleteStudentEnrolledCourseById);

const studentEnrolledCourseRouter = router;

export default studentEnrolledCourseRouter;
