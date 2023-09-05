import express from "express";
import * as offeredCourseClassScheduleController from "./offeredCourseClassSchedule.controller";
import requestValidator from "../../middleware/requestValidator";
import * as OfferedCourseClassScheduleValidation from "./offeredCourseClassSchedule.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get(
  "/",
  offeredCourseClassScheduleController.getAllOfferedCourseClassSchedule,
);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(
    OfferedCourseClassScheduleValidation.createOfferedCourseClassScheduleValidation,
  ),
  offeredCourseClassScheduleController.createOfferedCourseClassSchedule,
);

router
  .route("/:id")
  .get(offeredCourseClassScheduleController.getOfferedCourseClassScheduleById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(
    offeredCourseClassScheduleController.deleteOfferedCourseClassScheduleById,
  )
  .patch(
    requestValidator(
      OfferedCourseClassScheduleValidation.updateOfferedCourseClassScheduleValidation,
    ),
    offeredCourseClassScheduleController.updateOfferedCourseClassScheduleById,
  );

export const OfferedCourseClassScheduleRouter = router;
