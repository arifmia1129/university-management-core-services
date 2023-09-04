import { Router } from "express";
import { academicSemesterRouter } from "../modules/academicSemester/academicSemester.route";
import { academicFacultyRouter } from "../modules/academicFaculty/academicFaculty.route";
import { academicDepartmentRouter } from "../modules/academicDepartment/academicDepartment.route";
import { studentRouter } from "../modules/student/student.route";
import { FacultyRouter } from "../modules/faculty/faculty.route";
import { buildingRouter } from "../modules/building/building.route";
import { RoomRouter } from "../modules/room/room.route";
import { CourseRouter } from "../modules/course/course.route";
import { semesterRegistrationRouter } from "../modules/semesterRegistration/semesterRegistration.route";

const router = Router();

const moduleRoutes = [
  { path: "/academic-semester", route: academicSemesterRouter },
  { path: "/academic-faculty", route: academicFacultyRouter },
  { path: "/academic-department", route: academicDepartmentRouter },
  { path: "/student", route: studentRouter },
  { path: "/faculty", route: FacultyRouter },
  { path: "/building", route: buildingRouter },
  { path: "/room", route: RoomRouter },
  { path: "/course", route: CourseRouter },
  { path: "/semester-registration", route: semesterRegistrationRouter },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
