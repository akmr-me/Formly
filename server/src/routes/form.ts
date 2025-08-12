import { Router } from "express";
import { fileterRequest } from "../middlewares/fileterRequest";
import { createFormSchema } from "../validators/form";
import {
  createFormController,
  getFormWithBlocksController,
} from "../controllers/form";

const router = Router();

// router.get("/", (req, res) => {});

router.post("/", fileterRequest(createFormSchema), createFormController);

router.get("/:shortFormId/blocks", getFormWithBlocksController);

export default router;
