import { NextFunction, Request, Response } from "express";
import { createStatementBlockService } from "../services/block/statement";
import {
  deleteBlockFileService,
  deleteBlockService,
  duplicateBlockService,
  getBlockByIdService,
  updateBlockFieldService,
} from "../services/block";

export const createBlockController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = req.body;

    const blockServices: Record<string, (data: any) => Promise<any>> = {
      statement: createStatementBlockService,
      // shortText: createShortTextBlockService,
      // other types mapped to services
    };

    const service = blockServices[type];
    if (!service) {
      return res.status(400).json({ error: `Unsupported block type: ${type}` });
    }

    const result = await service(req.body);

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getBlockByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const block = await getBlockByIdService(id);

    return res.status(200).json({ ...block });
  } catch (error) {
    return next(error);
  }
};

export const updateBlockFieldController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { type, ...data } = req.body;
    const updatedBlock = await updateBlockFieldService(id, data);
    return res.status(200).json({ ...updatedBlock });
  } catch (error) {
    return next(error);
  }
};

export const deleteBlockController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await deleteBlockService(id);
    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

export const deleteBlockFileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    await deleteBlockFileService(id);
    return res.sendStatus(204);
  } catch (error) {
    return next(error);
  }
};

export const duplicateBlockController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    console.log("request for dulication", id);
    const duplicatedBlock = await duplicateBlockService(id);
    return res.status(201).json({ ...duplicatedBlock });
  } catch (error) {
    return next(error);
  }
};
