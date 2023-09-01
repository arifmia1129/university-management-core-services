import { z } from "zod";

export const createFacultyValidation = z.object({
  body: z.object({
    facultyId: z.string({
      required_error: "faculty ID is required",
    }),
    firstName: z.string({
      required_error: "First Name is required",
    }),
    lastName: z.string({
      required_error: "Last Name is required",
    }),
    designation: z.string({
      required_error: "Faculty designation is required",
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
    academicDepartmentId: z.string({
      required_error: "Academic Department ID is required",
    }),
    academicFacultyId: z.string({
      required_error: "Academic Faculty ID is required",
    }),
  }),
});

export const updateFacultyValidation = z.object({
  body: z.object({
    facultyId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    designation: z.string().optional(),
    middleName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().email().optional(),
    contactNo: z.number().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    academicDepartmentId: z.string().optional(),
    academicFacultyId: z.string().optional(),
  }),
});
