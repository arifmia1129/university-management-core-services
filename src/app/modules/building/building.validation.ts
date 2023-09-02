import { z } from "zod";

export const createBuildingValidation = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
  }),
});
export const updateBuildingValidation = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});
