import { NextFunction, Request, Response } from "express";
import {
  createFormService,
  getFormByShortIdService,
  getFormWithBlocksService,
} from "../services/form";

export const createFormController = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newCreatedForm = await createFormService();

    return res.status(201).json({ ...newCreatedForm });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getFormByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json({});
  } catch (error) {
    return next(error);
  }
};

export const getFormWithBlocksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shortFormId } = req.params;
    const form = await getFormWithBlocksService(shortFormId);

    return res.status(200).json({ ...form });
  } catch (error) {
    return next(error);
  }
};
