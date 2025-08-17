import { Request, Response, NextFunction } from "express";
import {
  createFormService,
  getFormByShortIdService,
  getPaginatedPublishedBlocksService,
  publishFormService,
  getFormWithBlocksService,
  createResponseService,
  createResponseValuesService,
} from "../services/form";
import { catchAsync } from "../utils/catchAsync";

export const createFormController = catchAsync(async (_, res) => {
  const newCreatedForm = await createFormService();

  res.status(201).json({
    status: "success",
    data: newCreatedForm,
  });
});

export const getFormByIdController = catchAsync(async (req, res) => {
  const { shortFormId } = req.params;

  const form = await getFormByShortIdService(shortFormId);

  res.status(200).json({
    status: "success",
    data: form,
  });
});

export const getFormWithBlocksController = catchAsync(async (req, res) => {
  const { shortFormId } = req.params;

  const form = await getFormWithBlocksService(shortFormId);

  res.status(200).json({
    status: "success",
    data: form,
  });
});

export const publishFormController = catchAsync(async (req, res) => {
  const { shortFormId } = req.params;

  await publishFormService(shortFormId);

  res.status(200).json({
    status: "success",
    message: "Form published successfully",
  });
});

export const getPaginatedPublishedBlocksController = catchAsync(
  async (req, res) => {
    const { shortFormId } = req.params;

    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const blocks = await getPaginatedPublishedBlocksService(
      shortFormId,
      page,
      limit
    );

    res.status(200).json({
      status: "success",
      data: blocks,
    });
  }
);

export const createResponseController = catchAsync(async (req, res) => {
  const { shortFormId } = req.params;
  const response = await createResponseService(shortFormId);

  res.status(201).json({
    status: "success",
    data: response,
  });
});

export const createResponseValuesController = catchAsync(async (req, res) => {
  const { responseId } = req.params;

  await createResponseValuesService(responseId, req.body);

  res.status(201).json({
    status: "success",
    message: "Form saved successfully",
  });
});
