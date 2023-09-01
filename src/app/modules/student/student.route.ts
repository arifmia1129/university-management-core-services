import express from "express";
import * as studentController from "./student.controller";
import requestValidator from "../../middleware/requestValidator";
import * as studentValidation from "./student.validation";

const router = express.Router();

router.get("/", studentController.getAllStudent);

router.post(
  "/create",
  requestValidator(studentValidation.createStudentValidation),
  studentController.createStudent,
);

router
  .route("/:id")
  .get(studentController.getStudentById)
  .delete(studentController.deleteStudentById)
  .patch(
    requestValidator(studentValidation.updateStudentValidation),
    studentController.updateStudentById,
  );

export const studentRouter = router;
