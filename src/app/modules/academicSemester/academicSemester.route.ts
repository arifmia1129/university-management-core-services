import express from "express";
import * as academicSemesterController from "./academicSemester.controller";
import requestValidator from "../../middleware/requestValidator";
import * as academicSemesterValidation from "./academicSemester.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", academicSemesterController.getAllAcademicSemester);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(academicSemesterValidation.createAcademicSemesterValidation),
  academicSemesterController.createAcademicSemester,
);

router
  .route("/:id")
  .get(academicSemesterController.getAcademicSemesterById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(academicSemesterController.deleteAcademicSemesterById)
  .patch(
    requestValidator(
      academicSemesterValidation.updateAcademicSemesterValidation,
    ),
    academicSemesterController.updateAcademicSemesterById,
  );

export const academicSemesterRouter = router;
