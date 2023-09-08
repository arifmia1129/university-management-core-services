import express from "express";
import * as studentController from "./student.controller";
import requestValidator from "../../middleware/requestValidator";
import * as studentValidation from "./student.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", studentController.getAllStudent);
router.get(
  "/my-course",
  auth(USER_ROLE_ENUM.STUDENT),
  studentController.myCourse,
);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(studentValidation.createStudentValidation),
  studentController.createStudent,
);

router
  .route("/:id")
  .get(studentController.getStudentById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(studentController.deleteStudentById)
  .patch(
    requestValidator(studentValidation.updateStudentValidation),
    studentController.updateStudentById,
  );

export const studentRouter = router;
