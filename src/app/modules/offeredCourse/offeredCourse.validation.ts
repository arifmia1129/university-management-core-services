import { z } from "zod";

export const createOfferedCourseValidation = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: "Academic department is required",
    }),
    semesterRegistrationId: z.string({
      required_error: "Semister registration is required",
    }),
    courseIds: z.array(z.string(), {
      required_error: "Course is required",
    }),
  }),
});
export const updateOfferedCourseValidation = z.object({
  body: z.object({
    academicDepartmentId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
    courseIds: z.array(z.string()).optional(),
  }),
});
