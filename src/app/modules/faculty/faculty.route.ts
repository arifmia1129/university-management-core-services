import express from "express";
import * as facultyController from "./faculty.controller";
import requestValidator from "../../middleware/requestValidator";
import * as FacultyValidation from "./faculty.validation";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";
import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", facultyController.getAllFaculty);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(FacultyValidation.createFacultyValidation),
  facultyController.createFaculty,
);
router.get("/faculties", facultyController.getCourseFaculty);
router
  .route("/:id")
  .get(facultyController.getFacultyById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(facultyController.deleteFacultyById)
  .patch(
    requestValidator(FacultyValidation.updateFacultyValidation),
    facultyController.updateFacultyById,
  );

router.post(
  "/assign-faculties",
  requestValidator(FacultyValidation.assignOrRemoveCourseFaculties),
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  facultyController.assignCourseFaculty,
);
router.post(
  "/remove-faculties",
  requestValidator(FacultyValidation.assignOrRemoveCourseFaculties),
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  facultyController.removeCourseFaculty,
);

export const FacultyRouter = router;
