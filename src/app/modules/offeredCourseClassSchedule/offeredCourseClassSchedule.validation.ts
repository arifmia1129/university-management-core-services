import { z } from "zod";

export const createOfferedCourseClassScheduleValidation = z.object({
  body: z.object({
    startTime: z.string().refine(startTime => startTime.trim() !== "", {
      message: "Start time is required and cannot be empty.",
    }),
    endTime: z.string().refine(endTime => endTime.trim() !== "", {
      message: "End time is required and cannot be empty.",
    }),
    dayOfWeek: z.enum([
      "SATURDAY",
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
    ]),
    offeredCourseSectionId: z
      .string()
      .refine(offeredCourseSectionId => offeredCourseSectionId.trim() !== "", {
        message: "Offered course section ID is required and cannot be empty.",
      }),
    semesterRegistrationId: z
      .string()
      .refine(semesterRegistrationId => semesterRegistrationId.trim() !== "", {
        message: "Semester registration ID is required and cannot be empty.",
      }),
    roomId: z.string().refine(roomId => roomId.trim() !== "", {
      message: "Room ID is required and cannot be empty.",
    }),
    facultyId: z.string().refine(facultyId => facultyId.trim() !== "", {
      message: "Faculty ID is required and cannot be empty.",
    }),
  }),
});
export const updateOfferedCourseClassScheduleValidation = z.object({
  body: z.object({
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    dayOfWeek: z
      .enum([
        "SATURDAY",
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
      ])
      .optional(),
    offeredCourseSectionId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
    roomId: z.string().optional(),
    facultyId: z.string().optional(),
  }),
});
