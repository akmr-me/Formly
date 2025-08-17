import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import ApiError from "../utils/ApiError";

const errorHandler = (
  err: unknown,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    status: "error",
    message,
    ...(env.NODE_ENV === "development" && { stack: (err as Error).stack }),
  });
};

export default errorHandler;
