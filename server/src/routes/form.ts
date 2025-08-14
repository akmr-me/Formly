import { Router } from "express";
import { fileterRequest } from "../middlewares/fileterRequest";
import { createFormSchema } from "../validators/form";
import {
  createFormController,
  getFormWithBlocksController,
  publishFormController,
  getPaginatedPublishedBlocksController,
} from "../controllers/form";

const router = Router();

// router.get("/", (req, res) => {});
// TODO: fix spelling change
router.post("/", fileterRequest(createFormSchema), createFormController);

router.get("/:shortFormId/blocks", getFormWithBlocksController);

router.patch("/:shortFormId/publish", publishFormController);

router.get(
  "/:shortFormId/published-blocks",
  getPaginatedPublishedBlocksController
);

export default router;
