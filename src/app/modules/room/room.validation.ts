import { z } from "zod";

export const createRoomValidation = z.object({
  body: z.object({
    roomNumber: z.string({
      required_error: "Room number is required",
    }),
    floor: z.string({
      required_error: "Floor name is required",
    }),
    buildingId: z.string({
      required_error: "Building ID is required",
    }),
  }),
});
export const updateRoomValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    floor: z.string().optional(),
    buildingId: z.string().optional(),
  }),
});
