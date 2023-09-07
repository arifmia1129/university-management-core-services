import { z } from "zod";

// Define a custom enum for SemesterRegistrationStatus
const SemesterRegistrationStatus = z.enum(["UPCOMING", "ONGOING", "ENDED"]);

export const createSemesterRegistrationValidation = z.object({
  body: z.object({
    startDate: z.string({
      required_error: "Start date is required",
    }),
    endDate: z.string({
      required_error: "End date is required",
    }),
    status: SemesterRegistrationStatus.optional(),
    minCredit: z.number().int().min(0).optional(),
    maxCredit: z.number().int().min(0).optional(),
    academicSemesterId: z
      .string()
      .refine(academicSemesterId => !!academicSemesterId, {
        message: "academicSemesterId is required",
      }),
  }),
});

export const updateSemesterRegistrationValidation = z.object({
  body: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: SemesterRegistrationStatus.optional(),
    minCredit: z.number().int().min(0).optional(),
    maxCredit: z.number().int().min(0).optional(),
    academicSemesterId: z.string().optional(),
  }),
});

export const enrollOrWithrewCourseValidation = z.object({
  body: z.object({
    offeredCourseId: z.string({
      required_error: "Offered corse id is required",
    }),
    offeredCourseSectionId: z.string({
      required_error: "Offered course section id is required",
    }),
  }),
});
