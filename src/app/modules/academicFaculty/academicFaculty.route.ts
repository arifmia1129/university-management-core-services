import express from "express";
import * as academicFacultyController from "./academicFaculty.controller";
import requestValidator from "../../middleware/requestValidator";
import * as academicFacultyValidation from "./academicFaculty.validation";

const router = express.Router();

router.get("/", academicFacultyController.getAllAcademicFaculty);

router.post(
  "/create",
  requestValidator(academicFacultyValidation.createAcademicFacultyValidation),
  academicFacultyController.createAcademicFaculty,
);

router
  .route("/:id")
  .get(academicFacultyController.getAcademicFacultyById)
  .delete(academicFacultyController.deleteAcademicFacultyById)
  .patch(
    requestValidator(academicFacultyValidation.updateAcademicFacultyValidation),
    academicFacultyController.updateAcademicFacultyById,
  );

export const academicFacultyRouter = router;
