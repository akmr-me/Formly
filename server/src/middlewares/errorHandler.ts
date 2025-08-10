import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import ApiError from "../utils/ApiError";

const errorHandler = (
  err: ApiError,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  console.log("errorhandler", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
