import express from "express";
import * as offeredCourseController from "./offeredCourse.controller";
import requestValidator from "../../middleware/requestValidator";
import * as offeredCourseValidation from "./offeredCourse.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", offeredCourseController.getAllOfferedCourse);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(offeredCourseValidation.createOfferedCourseValidation),
  offeredCourseController.createOfferedCourse,
);

router
  .route("/:id")
  .get(offeredCourseController.getOfferedCourseById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(offeredCourseController.deleteOfferedCourseById)
  .patch(
    requestValidator(offeredCourseValidation.updateOfferedCourseValidation),
    offeredCourseController.updateOfferedCourseById,
  );

export const offeredCourseRouter = router;
