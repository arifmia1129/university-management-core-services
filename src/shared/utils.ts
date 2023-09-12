/* eslint-disable @typescript-eslint/no-explicit-any */
export const asyncForEach = async (arr: unknown[], callback: any) => {
  if (!Array.isArray(arr)) {
    throw new Error("Expected an array");
  }

  for (let index = 0; index < arr.length; index++) {
    await callback(arr[index], index, arr);
  }
};

type Slot = {
  startTime: string;
  endTime: string;
};

export const hasTimeConflict = (existingSlots: Slot[], newSlot: Slot) => {
  for (const slot of existingSlots) {
    const existingStartHours = slot.startTime.split(":")[0];

    const existingStartMinutes = slot.startTime.split(":")[1];
    const existingEndHours = slot.endTime.split(":")[0];
    const existingEndMinutes = slot.endTime.split(":")[1];

    const newStartHours = newSlot.startTime.split(":")[0];
    const newStartMinutes = newSlot.startTime.split(":")[1];
    const newEndHours = newSlot.endTime.split(":")[0];
    const newEndMinutes = newSlot.endTime.split(":")[1];

    const existingSlotStart = new Date(
      2023,
      9,
      5,
      parseInt(existingStartHours),
      parseInt(existingStartMinutes),
    ).toISOString();
    const existingSlotEnd = new Date(
      2023,
      9,
      5,
      parseInt(existingEndHours),
      parseInt(existingEndMinutes),
    ).toISOString();

    const newSlotStart = new Date(
      2023,
      9,
      5,
      parseInt(newStartHours),
      parseInt(newStartMinutes),
    ).toISOString();
    const newSlotEnd = new Date(
      2023,
      9,
      5,
      parseInt(newEndHours),
      parseInt(newEndMinutes),
    ).toISOString();

    if (newSlotStart < existingSlotEnd && newSlotEnd > existingSlotStart) {
      return true;
    }
  }
  return false;
};
