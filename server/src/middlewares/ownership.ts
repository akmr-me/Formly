import { NextFunction, Request, Response } from "express";
import { db } from "../config/db";
import ApiError from "../utils/ApiError";

export async function requireFormOwnerByShortId(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    const shortFormId = req.params.shortFormId ?? req.body.formId;
    if (!shortFormId) {
      return next(new ApiError(400, "Form id is required"));
    }

    await assertFormOwner(shortFormId, req.user!.id);
    next();
  } catch (error) {
    next(error);
  }
}

export async function requireBlockOwnerById(
  req: Request,
  _: Response,
  next: NextFunction
) {
  try {
    const blockId = req.params.id;
    const block = await db
      .selectFrom("Block")
      .innerJoin("Form", "Form.shortId", "Block.formId")
      .select(["Form.ownerId"])
      .where("Block.id", "=", blockId)
      .executeTakeFirst();

    if (!block) {
      throw new ApiError(404, "Block not found");
    }

    if (!block.ownerId || block.ownerId !== req.user!.id) {
      throw new ApiError(403, "You do not have access to this block");
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function assertFormOwner(shortFormId: string, userId: string) {
  const form = await db
    .selectFrom("Form")
    .select(["ownerId"])
    .where("shortId", "=", shortFormId)
    .executeTakeFirst();

  if (!form) {
    throw new ApiError(404, "Form not found");
  }

  if (!form.ownerId || form.ownerId !== userId) {
    throw new ApiError(403, "You do not have access to this form");
  }
}
