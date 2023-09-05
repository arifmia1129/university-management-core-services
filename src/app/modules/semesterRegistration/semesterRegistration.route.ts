import express from "express";
import * as semesterRegistrationController from "./semesterRegistration.controller";
import requestValidator from "../../middleware/requestValidator";
import * as semesterValidation from "./semesterRegistration.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.post(
  "/student",
  auth(USER_ROLE_ENUM.STUDENT),
  semesterRegistrationController.studentSemesterRegistration,
);

router.get("/", semesterRegistrationController.getAllSemesterRegistration);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(semesterValidation.createSemesterRegistrationValidation),
  semesterRegistrationController.createSemesterRegistration,
);

router
  .route("/:id")
  .get(semesterRegistrationController.getSemesterRegistrationById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(semesterRegistrationController.deleteSemesterRegistrationById)
  .patch(
    requestValidator(semesterValidation.updateSemesterRegistrationValidation),
    semesterRegistrationController.updateSemesterRegistrationById,
  );

export const semesterRegistrationRouter = router;
