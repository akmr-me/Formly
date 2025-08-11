import { NextFunction, Request, Response } from "express";
import { createStatementBlockService } from "../services/block/statement";
import { getBlockByIdService } from "../services/block";

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
    console.log("block", block);
    return res.status(200).json({ ...block });
  } catch (error) {
    return next(error);
  }
};
