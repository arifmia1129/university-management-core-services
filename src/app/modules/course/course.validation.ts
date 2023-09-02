import { z } from "zod";

export const createCourseValidation = z.object({
  body: z.object({
    title: z.string({
      required_error: "Course title is required",
    }),
    code: z.string({
      required_error: "Course code is required",
    }),
    credits: z.number({
      required_error: "Course credits is required",
    }),
    preRequisiteCourses: z
      .object({
        preRequisiteCourseId: z.string().optional(),
      })
      .array()
      .optional(),
  }),
});
export const updateCourseValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.string().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z
      .object({
        preRequisiteCourseId: z.string().optional(),
      })
      .array()
      .optional(),
  }),
});
