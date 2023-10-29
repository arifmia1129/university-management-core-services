import express from "express";
import { StudentSemesterPaymentController } from "./studentSemesterPayment.controller";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", StudentSemesterPaymentController.getAllStudentSemesterPayment);
router.get(
  "/my-payment",
  auth(USER_ROLE_ENUM.STUDENT),
  StudentSemesterPaymentController.getMySemesterPayment,
);

router.post(
  "/initiate-payment",
  auth(USER_ROLE_ENUM.STUDENT),
  StudentSemesterPaymentController.initiatePayment,
);
router.post(
  "/complete-payment",
  auth(USER_ROLE_ENUM.STUDENT),
  StudentSemesterPaymentController.completePayment,
);

router
  .route("/:id")
  .get(StudentSemesterPaymentController.getStudentSemesterPaymentById);

const StudentSemesterPaymentRouter = router;

export default StudentSemesterPaymentRouter;
