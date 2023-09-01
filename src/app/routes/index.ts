import { Router } from "express";
import { academicSemesterRouter } from "../modules/academicSemester/academicSemester.route";
import { academicFacultyRouter } from "../modules/academicFaculty/academicFaculty.route";

const router = Router();

const moduleRoutes = [
  { path: "/academic-semester", route: academicSemesterRouter },
  { path: "/academic-faculty", route: academicFacultyRouter },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
