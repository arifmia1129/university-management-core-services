import { PrismaClient } from "@prisma/client";
import {
  DefaultArgs,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";
import prisma from "../../../shared/prisma";

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
