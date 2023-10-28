/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Prisma,
  PrismaClient,
  StudentSemesterPayment,
  paymentStatus,
} from "@prisma/client";
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
import ApiError from "../../../errors/ApiError";
import httpStatus from "../../../shared/httpStatus";
import axios from "axios";
import config from "../../../config";

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

const initiatePayment = async (payload: any, user: any) => {
  const isStudentExist = await prisma.student.findFirst({
    where: {
      studentId: user.userId,
    },
  });

  if (!isStudentExist) {
    throw new ApiError("Student not found", httpStatus.NOT_FOUND);
  }

  const studentPaymentInfo = await prisma.studentSemesterPayment.findFirst({
    where: {
      academicSemesterId: payload?.academicSemesterId,
      studentId: payload?.studentId,
    },
  });

  if (!studentPaymentInfo) {
    throw new ApiError(`Student payment info not found`, httpStatus.NOT_FOUND);
  }

  if (studentPaymentInfo.paymentStatus === paymentStatus.FULL_PAID) {
    throw new ApiError(`Student payment already paid`, httpStatus.BAD_REQUEST);
  }

  const studentPaymentHistory =
    await prisma.studentSemesterPaymentHistory.findFirst({
      where: {
        studentSemesterPaymentId: studentPaymentInfo.id,
        isPaid: false,
      },
    });

  if (!studentPaymentHistory) {
    const { data } = await axios.post(config.payment_method.url as string, {
      totalFee: (studentPaymentInfo.totalDueAmount as number) + 100,
      transId: "123",
      studentId: isStudentExist.studentId,
      studentName: isStudentExist.firstName + " " + isStudentExist.lastName,
      studentEmail: isStudentExist.email,
      address: "Gazipur, Dhaka",
      contactNo: isStudentExist.contactNo,
    });

    return data.data;
  }
};

export const StudentSemesterPaymentService = {
  getAllStudentPaymentCourseService,
  initiatePayment,
};
