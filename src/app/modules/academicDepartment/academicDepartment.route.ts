import express from "express";
import * as academicDepartmentController from "./academicDepartment.controller";
import requestValidator from "../../middleware/requestValidator";
import * as academicDepartmentValidation from "./academicDepartment.validation";

const router = express.Router();

router.get("/", academicDepartmentController.getAllAcademicDepartment);

router.post(
  "/create",
  requestValidator(
    academicDepartmentValidation.createAcademicDepartmentValidation,
  ),
  academicDepartmentController.createAcademicDepartment,
);

router
  .route("/:id")
  .get(academicDepartmentController.getAcademicDepartmentById)
  .delete(academicDepartmentController.deleteAcademicDepartmentById)
  .patch(
    requestValidator(
      academicDepartmentValidation.updateAcademicDepartmentValidation,
    ),
    academicDepartmentController.updateAcademicDepartmentById,
  );

export const academicDepartmentRouter = router;
