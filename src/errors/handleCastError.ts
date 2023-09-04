import { Prisma } from "@prisma/client";
import { ErrorMessage } from "../interfaces/error.interface";

const handleCastError = (
  err: Prisma.PrismaClientKnownRequestError,
): ErrorMessage[] => {
  let message;
  switch (err.code) {
    case "P2002":
      message = `Duplicate field value: ${err?.meta?.target}`;
      break;
    case "P2014":
      message = `Invalid ID: ${err?.meta?.target}`;
      break;
    case "P2003":
      message = `Invalid input data: ${err?.meta?.target}`;
      break;
    case "P2025":
      message = `An operation failed because it depends on one or more records that were required but not found. ${err?.meta?.cause}`;
      break;
    default:
      message = `Something went wrong: ${err.message}`;
  }

  return [
    {
      path: "",
      message,
    },
  ];
};

export default handleCastError;
