export default class ApiError extends Error {
  statusCode: number;
  isOprational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOprational = isOperational;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}
