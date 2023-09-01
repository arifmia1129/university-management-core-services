import { Router } from "express";
import { academicSemesterRouter } from "../modules/academicSemester/academicSemester.route";

const router = Router();

const moduleRoutes = [
  { path: "/academic-semester", route: academicSemesterRouter },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
