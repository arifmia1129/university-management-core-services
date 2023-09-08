import express from "express";
import { StudentSemesterPaymentController } from "./studentSemesterPayment.controller";

const router = express.Router();

router.get("/", StudentSemesterPaymentController.getAllStudentSemesterPayment);

router
  .route("/:id")
  .get(StudentSemesterPaymentController.getAllStudentSemesterPayment);

const StudentSemesterPaymentRouter = router;

export default StudentSemesterPaymentRouter;
