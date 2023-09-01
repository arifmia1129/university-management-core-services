import { PrismaClient, AcademicSemester } from "@prisma/client";
import { ResponseWithPagination } from "../../../interfaces/databaseQuery.interface";

const prisma = new PrismaClient();

export const createAcademicSemesterService = async (
  semester: AcademicSemester,
): Promise<AcademicSemester> => {
  return await prisma.academicSemester.create({
    data: semester,
  });
};

export const getAllAcademicSemesterService = async ():Promise<ResponseWithPagination<AcademicSemester[]>> => {
  const result = await prisma.academicSemester.findMany();

  const total = await prisma.academicSemester.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};
