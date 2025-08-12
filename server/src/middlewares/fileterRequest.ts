import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

export const fileterRequest =
  (schema: ZodObject<any>) =>
  (req: Request, _: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = result.body;
      // req.params = result.params;
      // req.query = result.query;

      next();
    } catch (err: any) {
      console.log(`${new Date().toISOString()} - Validation error: `);
      console.log(err);
      next(new ApiError(400, JSON.parse(err.message)[0].message));
    }
  };
