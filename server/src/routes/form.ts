import { Router } from "express";
import { fileterRequest } from "../middlewares/fileterRequest";
import { createFormSchema } from "../validators/form";
import {
  createFormController,
  getOwnerFormsController,
  getFormWithBlocksController,
  publishFormController,
  getPaginatedPublishedBlocksController,
  getFormByIdController,
  createResponseController,
  createResponseValuesController,
  getFormResponsesController,
} from "../controllers/form";
import { authenticate } from "../middlewares/auth";
import { requireFormOwnerByShortId } from "../middlewares/ownership";

const router = Router();

router.get("/", authenticate, getOwnerFormsController);

router.post(
  "/",
  authenticate,
  fileterRequest(createFormSchema),
  createFormController
);

router.get("/:shortFormId", getFormByIdController);

router.get(
  "/:shortFormId/blocks",
  authenticate,
  requireFormOwnerByShortId,
  getFormWithBlocksController
);

router.patch(
  "/:shortFormId/publish",
  authenticate,
  requireFormOwnerByShortId,
  publishFormController
);

router.get(
  "/:shortFormId/responses",
  authenticate,
  requireFormOwnerByShortId,
  getFormResponsesController
);

router.post("/:shortFormId/response", createResponseController);
router.post(
  "/:shortFormId/response/:responseId",
  createResponseValuesController
);

router.get(
  "/:shortFormId/published-blocks",
  getPaginatedPublishedBlocksController
);

export default router;
