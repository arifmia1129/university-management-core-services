import express from "express";
import * as courseController from "./course.controller";
import requestValidator from "../../middleware/requestValidator";
import * as CourseValidation from "./course.validation";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", courseController.getAllCourse);

router.post(
  "/create",
  auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN),
  requestValidator(CourseValidation.createCourseValidation),
  courseController.createCourse,
);
router.get("/faculties", courseController.getCourseFaculty);
router
  .route("/:id")
  .get(courseController.getCourseById)
  .all(auth(USER_ROLE_ENUM.ADMIN, USER_ROLE_ENUM.SUPER_ADMIN))
  .delete(courseController.deleteCourseById)
  .patch(
    requestValidator(CourseValidation.updateCourseValidation),
    courseController.updateCourseById,
  );

router.post("/assign-faculties", courseController.assignCourseFaculty);
router.post("/remove-faculties", courseController.removeCourseFaculty);

export const CourseRouter = router;
