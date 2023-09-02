import express from "express";
import * as academicDepartmentController from "./academicDepartment.controller";
import requestValidator from "../../middleware/requestValidator";
import * as academicDepartmentValidation from "./academicDepartment.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", academicDepartmentController.getAllAcademicDepartment);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(
    academicDepartmentValidation.createAcademicDepartmentValidation,
  ),
  academicDepartmentController.createAcademicDepartment,
);

router
  .route("/:id")
  .get(academicDepartmentController.getAcademicDepartmentById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(academicDepartmentController.deleteAcademicDepartmentById)
  .patch(
    requestValidator(
      academicDepartmentValidation.updateAcademicDepartmentValidation,
    ),
    academicDepartmentController.updateAcademicDepartmentById,
  );

export const academicDepartmentRouter = router;
