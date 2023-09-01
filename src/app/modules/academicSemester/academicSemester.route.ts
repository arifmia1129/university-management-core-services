import express from "express";
import * as academicSemesterController from "./academicSemester.controller";
import requestValidator from "../../middleware/requestValidator";
import * as academicSemesterValidation from "./academicSemester.validation";

const router = express.Router();

router.get("/", academicSemesterController.getAllAcademicSemester);

router.post(
  "/create",
  requestValidator(academicSemesterValidation.createAcademicSemesterValidation),
  academicSemesterController.createAcademicSemester,
);

router
  .route("/:id")
  .get(academicSemesterController.getAcademicSemesterById)
  .patch(
    requestValidator(
      academicSemesterValidation.updateAcademicSemesterValidation,
    ),
    academicSemesterController.updateAcademicSemesterById,
  );

export const academicSemesterRouter = router;
