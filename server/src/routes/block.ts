import { Router } from "express";
import {
  createBlockController,
  getBlockByIdController,
} from "../controllers/block";
import { filterRequestByBlockType } from "../middlewares/filterRequestByBlockType";
import { createStatementBlockSchema } from "../validators/block/statement";
import { createShortTextBlockSchema } from "../validators/block/shortText";

const router = Router();

const schemas = {
  statement: createStatementBlockSchema,
  shortText: createShortTextBlockSchema,
};

router.post(
  "/",
  // @ts-ignore
  filterRequestByBlockType(schemas),
  createBlockController
);

router.get("/:id", getBlockByIdController);

export default router;
