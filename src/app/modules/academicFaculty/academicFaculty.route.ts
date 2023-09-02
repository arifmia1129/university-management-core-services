import express from "express";
import * as academicFacultyController from "./academicFaculty.controller";
import requestValidator from "../../middleware/requestValidator";
import * as academicFacultyValidation from "./academicFaculty.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", academicFacultyController.getAllAcademicFaculty);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(academicFacultyValidation.createAcademicFacultyValidation),
  academicFacultyController.createAcademicFaculty,
);

router
  .route("/:id")
  .get(academicFacultyController.getAcademicFacultyById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(academicFacultyController.deleteAcademicFacultyById)
  .patch(
    requestValidator(academicFacultyValidation.updateAcademicFacultyValidation),
    academicFacultyController.updateAcademicFacultyById,
  );

export const academicFacultyRouter = router;
