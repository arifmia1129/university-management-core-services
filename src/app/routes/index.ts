import { Router } from "express";
import { academicSemesterRouter } from "../modules/academicSemester/academicSemester.route";
import { academicFacultyRouter } from "../modules/academicFaculty/academicFaculty.route";
import { academicDepartmentRouter } from "../modules/academicDepartment/academicDepartment.route";
import { studentRouter } from "../modules/student/student.route";
import { FacultyRouter } from "../modules/faculty/faculty.route";

const router = Router();

const moduleRoutes = [
  { path: "/academic-semester", route: academicSemesterRouter },
  { path: "/academic-faculty", route: academicFacultyRouter },
  { path: "/academic-department", route: academicDepartmentRouter },
  { path: "/student", route: studentRouter },
  { path: "/faculty", route: FacultyRouter },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
