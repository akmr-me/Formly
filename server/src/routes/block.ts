import { Router } from "express";
import {
  createBlockController,
  getBlockByIdController,
  updateBlockFieldController,
} from "../controllers/block";
import { filterRequestByBlockType } from "../middlewares/filterRequestByBlockType";
import {
  createStatementBlockSchema,
  updateStatementBlockSchema,
} from "../validators/block/statement";
import { createShortTextBlockSchema } from "../validators/block/shortText";

const router = Router();

const schemas = {
  statement: createStatementBlockSchema,
  shortText: createShortTextBlockSchema,
};

const updateSchema = {
  statement: updateStatementBlockSchema,
  // shortText: createShortTextBlockSchema.partial(),
};

router.post(
  "/",
  // @ts-ignore
  filterRequestByBlockType(schemas),
  createBlockController
);

router.get("/:id", getBlockByIdController);

router.patch(
  "/:id",
  filterRequestByBlockType(updateSchema),
  updateBlockFieldController
);

export default router;
