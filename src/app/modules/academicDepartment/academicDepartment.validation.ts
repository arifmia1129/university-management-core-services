import { z } from "zod";

export const createAcademicDepartmentValidation = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    academicFacultyId: z.string({
      required_error: "Academic department ID is required",
    }),
  }),
});
export const updateAcademicDepartmentValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    academicFacultyId: z.string().optional(),
  }),
});
