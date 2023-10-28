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
const getMySemesterPayment = async (
  filters: Filter,
  options: Pagination,
  studentId: string,
): Promise<ResponseWithPagination<StudentSemesterPayment[]>> => {
  const { limit, skip, sortOrder, sortBy } =
    paginationHelper.calculatePagination(options);

  const andConditions = [];

  const { searchTerm, ...filterData } = filters;

  const isStudentExist = await prisma.student.findFirst({
    where: {
      studentId,
    },
  });

  if (!isStudentExist) {
    throw new ApiError("Student not found", httpStatus.NOT_FOUND);
  }

  andConditions.push({
    studentId: isStudentExist.id,
  });

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

  const total = result.length;

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
    include: {
      academicSemester: true,
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

  if (studentPaymentHistory) {
    const { data } = await axios.post(config.payment_method.url as string, {
      totalFee: (studentPaymentHistory.dueAmount as number) + 100,
      transId: studentPaymentHistory.transactionId,
      studentId: isStudentExist.studentId,
      studentName: isStudentExist.firstName + " " + isStudentExist.lastName,
      studentEmail: isStudentExist.email,
      address: "Gazipur, Dhaka",
      contactNo: isStudentExist.contactNo,
    });

    return data.data;
  } else {
    let payableAmount = 0;
    if (
      payload.paymentType === "PARTIAL" &&
      studentPaymentInfo.totalPaidAmount === 0
    ) {
      payableAmount = studentPaymentInfo.partialPaymentAmount;
    } else {
      payableAmount = studentPaymentInfo.totalDueAmount as number;
    }

    const dataForInsert = {
      studentSemesterPaymentId: studentPaymentInfo.id,
      transactionId: `${isStudentExist.id}-${
        studentPaymentInfo.academicSemester.title
      }-${Date.now()}`,
      dueAmount: payableAmount,
      paidAmount: 0,
    };

    const newPaymentHistory = await prisma.studentSemesterPaymentHistory.create(
      {
        data: dataForInsert,
      },
    );

    const { data } = await axios.post(config.payment_method.url as string, {
      totalFee: (newPaymentHistory.dueAmount as number) + 100,
      transId: newPaymentHistory.transactionId,
      studentId: isStudentExist.studentId,
      studentName: isStudentExist.firstName + " " + isStudentExist.lastName,
      studentEmail: isStudentExist.email,
      address: "Gazipur, Dhaka",
      contactNo: isStudentExist.contactNo,
    });

    return data.data;
  }
};

const completePayment = async (transactionId: string) => {
  const isTransHistoryExist =
    await prisma.studentSemesterPaymentHistory.findFirst({
      where: {
        transactionId,
      },
    });

  if (!isTransHistoryExist) {
    throw new ApiError("Transaction history not found", httpStatus.NOT_FOUND);
  }

  if (isTransHistoryExist.isPaid) {
    throw new ApiError("Transaction already completed", httpStatus.BAD_REQUEST);
  }

  const isStudentSemesterPaymentExist =
    await prisma.studentSemesterPayment.findUnique({
      where: {
        id: isTransHistoryExist.studentSemesterPaymentId,
      },
    });

  if (!isStudentSemesterPaymentExist) {
    throw new ApiError(
      "Student semester payment information not found",
      httpStatus.NOT_FOUND,
    );
  }

  await prisma.$transaction(async tx => {
    await tx.studentSemesterPaymentHistory.update({
      where: {
        id: isTransHistoryExist.id,
      },
      data: {
        isPaid: true,
        paidAmount: isTransHistoryExist.dueAmount,
        dueAmount: 0,
      },
    });

    const res = await tx.studentSemesterPayment.update({
      where: {
        id: isStudentSemesterPaymentExist.id,
      },
      data: {
        totalPaidAmount:
          isStudentSemesterPaymentExist.totalPaidAmount +
          isTransHistoryExist.paidAmount,
        totalDueAmount:
          (isStudentSemesterPaymentExist?.totalDueAmount as number) -
          isTransHistoryExist.paidAmount,

        paymentStatus:
          (isStudentSemesterPaymentExist.totalDueAmount as number) -
            isTransHistoryExist.dueAmount ===
          0
            ? paymentStatus.FULL_PAID
            : paymentStatus.PARTIAL_PAID,
      },
    });
    return res;
  });
};

export const StudentSemesterPaymentService = {
  getAllStudentPaymentCourseService,
  initiatePayment,
  completePayment,
  getMySemesterPayment,
};
