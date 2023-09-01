import { z } from "zod";

export const createStudentValidation = z.object({
  body: z.object({
    studentId: z.string({
      required_error: "Student ID is required",
    }),
    firstName: z.string({
      required_error: "First Name is required",
    }),
    lastName: z.string({
      required_error: "Last Name is required",
    }),
    middleName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string({
      required_error: "Email is required",
    }),
    contactNo: z.number({
      required_error: "Contact Number is required",
    }),
    gender: z.string({
      required_error: "Gender is required",
    }),
    bloodGroup: z.string({
      required_error: "Blood Group is required",
    }),
    academicSemesterId: z.string({
      required_error: "Academic Semester ID is required",
    }),
    academicDepartmentId: z.string({
      required_error: "Academic Department ID is required",
    }),
    academicFacultyId: z.string({
      required_error: "Academic Faculty ID is required",
    }),
  }),
});

export const updateStudentValidation = z.object({
  body: z.object({
    studentId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().email().optional(),
    contactNo: z.number().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    academicSemesterId: z.string().optional(),
    academicDepartmentId: z.string().optional(),
    academicFacultyId: z.string().optional(),
  }),
});
