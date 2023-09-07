import {
  SemesterRegistration,
  StudentSemesterRegistration,
} from "@prisma/client";

export type IStudentSemesterRegistration = {
  semesterRegistration: SemesterRegistration;
  studentSemesterRegistration: StudentSemesterRegistration;
};

export type ICourseEnrollRequest = {
  offeredCourseId: string;
  offeredCourseSectionId: string;
};
