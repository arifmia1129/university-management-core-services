import { Prisma, PrismaClient, StudentSemesterPayment } from "@prisma/client";
import {
  DefaultArgs,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";
import prisma from "../../../shared/prisma";
import {
  Filter,
  Pagination,
  ResponseWithPagination,
} from "../../../interfaces/databaseQuery.interface";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { studentSemesterPaymentSearchableField } from "./studentSemesterPayment.constant";

export type CreatePayment = {
  studentId: string;
  academicSemesterId: string;
  totalPaymentAmount: number;
};

export const createSemesterPayment = async (
  tx: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >,
  payload: CreatePayment,
) => {
  const { studentId, academicSemesterId, totalPaymentAmount } = payload;

  const isExist = await prisma.studentSemesterPayment.findFirst({
    where: {
      studentId,
      academicSemesterId,
    },
  });

  const data = {
    studentId,
    academicSemesterId,
    fullPaymentAmount: totalPaymentAmount,
    partialPaymentAmount: totalPaymentAmount / 2,
    totalDueAmount: totalPaymentAmount,
    totalPaidAmount: 0,
  };

  if (!isExist) {
    await prisma.studentSemesterPayment.create({
      data,
    });
  }
};

const getAllStudentPaymentCourseService = async (
  filters: Filter,
  options: Pagination,
): Promise<ResponseWithPagination<StudentSemesterPayment[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  if (searchTerm) {
    andConditions.push({
      OR: studentSemesterPaymentSearchableField.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.StudentSemesterPaymentWhereInput =
    andConditions?.length ? { AND: andConditions } : {};

  const result = await prisma.studentSemesterPayment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.studentSemesterPayment.count();

  return {
    meta: {
      total,
      page: 1,
      limit: 1,
    },
    data: result,
  };
};

export const StudentSemesterPaymentService = {
  getAllStudentPaymentCourseService,
};
