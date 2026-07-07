import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { verifyAuthToken } from "../services/auth";
import ApiError from "../utils/ApiError";

export type AuthUser = {
  id: string;
  email: string;
};

export function authenticate(req: Request, _: Response, next: NextFunction) {
  const token = req.cookies?.[env.AUTH_COOKIE_NAME];

  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    const payload = verifyAuthToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
    };
    next();
  } catch {
    next(new ApiError(401, "Authentication required"));
  }
}
