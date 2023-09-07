import express from "express";
import * as semesterRegistrationController from "./semesterRegistration.controller";
import requestValidator from "../../middleware/requestValidator";
import * as semesterValidation from "./semesterRegistration.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get(
  "/my-registration",
  auth(USER_ROLE_ENUM.STUDENT),
  semesterRegistrationController.getRegistration,
);
router.post(
  "/student",
  auth(USER_ROLE_ENUM.STUDENT),
  semesterRegistrationController.studentSemesterRegistration,
);
router.post(
  "/confirm-registration",
  auth(USER_ROLE_ENUM.STUDENT),
  semesterRegistrationController.confirmRegistration,
);
router.post(
  "/course-enroll",
  requestValidator(semesterValidation.enrollOrWithrewCourseValidation),
  auth(USER_ROLE_ENUM.STUDENT),
  semesterRegistrationController.studentSemesterRegistrationCourseEnroll,
);
router.post(
  "/course-withdrew",
  requestValidator(semesterValidation.enrollOrWithrewCourseValidation),
  auth(USER_ROLE_ENUM.STUDENT),
  semesterRegistrationController.studentSemesterRegistrationCourseWithdrew,
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
