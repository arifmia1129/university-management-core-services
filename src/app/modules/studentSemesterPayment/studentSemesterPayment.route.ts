import express from "express";
import { StudentSemesterPaymentController } from "./studentSemesterPayment.controller";
import auth from "../../middleware/auth";
import { USER_ROLE_ENUM } from "../../../enums/user.enum";

const router = express.Router();

router.get("/", StudentSemesterPaymentController.getAllStudentSemesterPayment);

router.post(
  "/initiate-payment",
  auth(USER_ROLE_ENUM.STUDENT),
  StudentSemesterPaymentController.initiatePayment,
);

router
  .route("/:id")
  .get(StudentSemesterPaymentController.getAllStudentSemesterPayment);

const StudentSemesterPaymentRouter = router;

export default StudentSemesterPaymentRouter;
