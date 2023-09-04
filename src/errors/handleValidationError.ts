import { Prisma } from "@prisma/client";

const handleValidationError = (err: Prisma.PrismaClientValidationError) => {
  return [
    {
      path: "",
      message: err.message,
    },
  ];
};

export default handleValidationError;
