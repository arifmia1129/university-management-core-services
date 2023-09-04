import { z } from "zod";

export const createofferedCourseSectionValidation = z.object({
  body: z.object({
    title: z
      .string()
      .min(1)
      .max(255)
      .refine(value => value.trim() !== "", {
        message: "Title is required and cannot be empty.",
      }),
    maxCapacity: z
      .number()
      .int()
      .min(1)
      .refine(value => value >= 0, {
        message: "Max capacity must be a non-negative integer.",
      }),
    currentlyEnrolledStudent: z
      .number()

      .int()
      .min(0)
      .refine(value => value >= 0, {
        message: "Currently enrolled students must be a non-negative integer.",
      })
      .optional(),
    offeredCourseId: z.string().uuid(),
  }),
});
export const updateofferedCourseSectionValidation = z.object({
  body: z.object({
    title: z.string().min(1).max(255).optional(),
    maxCapacity: z.number().int().min(1).optional(),
    currentlyEnrolledStudent: z.number().int().min(0).optional(),
    offeredCourseId: z.string().uuid().optional(),
    semesterRegistrationId: z.string().uuid().optional(),
  }),
});
