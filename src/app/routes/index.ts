import { Router } from "express";
import userRouter from "../modules/user/user.router";
import academicSemesterRouter from "../modules/academicSemester/academicSemester.router";
import academicFacultyRouter from "../modules/academicFaculty/academicFaculty.router";
import academicDepartmentRouter from "../modules/academicDepartment/academicDepartment.router";
import studentRouter from "../modules/student/student.router";
import facultyRouter from "../modules/faculty/faculty.route";
import managementDepartmentRouter from "../modules/managementDepartment/managementDepartment.router";
import adminRouter from "../modules/admin/admin.route";
import authRouter from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
  { path: "/user", route: userRouter },
  { path: "/academic-semester", route: academicSemesterRouter },
  { path: "/academic-faculty", route: academicFacultyRouter },
  { path: "/academic-department", route: academicDepartmentRouter },
  { path: "/student", route: studentRouter },
  { path: "/faculty", route: facultyRouter },
  { path: "/management-departments", route: managementDepartmentRouter },
  { path: "/admins", route: adminRouter },
  { path: "/auth", route: authRouter },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
