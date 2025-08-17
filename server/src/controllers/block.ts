import { Request, Response, NextFunction } from "express";
import { createStatementBlockService } from "../services/block/statement";
import {
  deleteBlockFileService,
  deleteBlockService,
  duplicateBlockService,
  getBlockByIdService,
  updateBlockFieldService,
} from "../services/block";
import { catchAsync } from "../utils/catchAsync";

export const createBlockController = catchAsync(async (req, res) => {
  const { type } = req.body;

  // const blockServices: Record<string, (data: any) => Promise<any>> = {
  //   statement: createStatementBlockService,
  //   shortText: createShortTextBlockService,
  //   // other types...
  // };
  //
  // const service = blockServices[type];
  // if (!service) {
  //   return res.status(400).json({
  //     status: "error",
  //     message: `Unsupported block type: ${type}`,
  //   });
  // }

  const result = await createStatementBlockService(req.body);

  res.status(201).json({
    status: "success",
    data: result,
  });
});

export const getBlockByIdController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const block = await getBlockByIdService(id);

  res.status(200).json({
    status: "success",
    data: block,
  });
});

export const updateBlockFieldController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { type, ...data } = req.body;

  const updatedBlock = await updateBlockFieldService(id, data);

  res.status(200).json({
    status: "success",
    data: updatedBlock,
  });
});

export const deleteBlockController = catchAsync(async (req, res) => {
  const { id } = req.params;

  await deleteBlockService(id);

  res.status(204).json({
    status: "success",
    message: "Block deleted successfully",
  });
});

export const deleteBlockFileController = catchAsync(async (req, res) => {
  const { id } = req.params;

  await deleteBlockFileService(id);

  res.status(204).json({
    status: "success",
    message: "Block file deleted successfully!",
  });
});

export const duplicateBlockController = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log("request for duplication", id);
  const duplicatedBlock = await duplicateBlockService(id);

  res.status(201).json({
    status: "success",
    data: duplicatedBlock,
  });
});
