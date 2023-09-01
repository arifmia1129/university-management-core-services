import express from "express";
import * as facultyController from "./faculty.controller";
import requestValidator from "../../middleware/requestValidator";
import * as FacultyValidation from "./faculty.validation";

const router = express.Router();

router.get("/", facultyController.getAllFaculty);

router.post(
  "/create",
  requestValidator(FacultyValidation.createFacultyValidation),
  facultyController.createFaculty,
);

router
  .route("/:id")
  .get(facultyController.getFacultyById)
  .delete(facultyController.deleteFacultyById)
  .patch(
    requestValidator(FacultyValidation.updateFacultyValidation),
    facultyController.updateFacultyById,
  );

export const FacultyRouter = router;
