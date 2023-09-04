/* eslint-disable @typescript-eslint/no-explicit-any */
export const asyncForEach = async (arr: unknown[], callback: any) => {
  if (!Array.isArray(arr)) {
    throw new Error("Expected an array");
  }

  for (let index = 0; index < arr.length; index++) {
    await callback(arr[index], index, arr);
  }
};
