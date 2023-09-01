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

export const academicSemesterRouter = router;
