import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";

type SchemaMap = {
  [key: string]: ZodObject<any>;
};

export const filterRequestByBlockType =
  (schemas: SchemaMap) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.body.type;
      const schema = schemas[type];

      if (!schema) {
        return next(new ApiError(400, `No schema found for type '${type}'`));
      }

      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = result.body;
      // Optionally handle params, query similarly

      next();
    } catch (err: any) {
      console.error(`[${new Date().toISOString()}] Validation error:`, err);
      next(new ApiError(400, err.errors?.[0]?.message || "Validation failed"));
    }
  };
