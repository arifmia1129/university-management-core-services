import { z } from "zod";

const updateCourseValidation = z.object({
  body: z.object({
    grade: z.string().optional(),
    point: z.number().optional(),
    totalMarks: z.number().optional(),
    status: z.string().optional(),
  }),
});

export const StudentEnrolledCourseValidation = {
  updateCourseValidation,
};
