import express from "express";
import * as offeredCourseSectionController from "./offeredCourseSection.controller";
import requestValidator from "../../middleware/requestValidator";
import * as OfferedCourseSectionValidation from "./offeredCourseSection.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", offeredCourseSectionController.getAllOfferedCourseSection);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(
    OfferedCourseSectionValidation.createofferedCourseSectionValidation,
  ),
  offeredCourseSectionController.createOfferedCourseSection,
);

router
  .route("/:id")
  .get(offeredCourseSectionController.getOfferedCourseSectionById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(offeredCourseSectionController.deleteOfferedCourseSectionById)
  .patch(
    requestValidator(
      OfferedCourseSectionValidation.updateofferedCourseSectionValidation,
    ),
    offeredCourseSectionController.updateOfferedCourseSectionById,
  );

export const offeredCourseSectionRouter = router;
