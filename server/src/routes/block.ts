import { Router } from "express";
import {
  createBlockController,
  deleteBlockFileController,
  deleteBlockController,
  getBlockByIdController,
  updateBlockFieldController,
  duplicateBlockController,
} from "../controllers/block";
import { filterRequestByBlockType } from "../middlewares/filterRequestByBlockType";
import {
  createStatementBlockSchema,
  updateStatementBlockSchema,
} from "../validators/block/statement";
import { createShortTextBlockSchema } from "../validators/block/shortText";
import { upload } from "../middlewares/multer";

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

router
  .route("/:id")
  .get(getBlockByIdController)
  .patch(filterRequestByBlockType(updateSchema), updateBlockFieldController)
  .delete(deleteBlockController);

router
  .route("/:id/upload")
  .patch(
    upload.single("file"),
    filterRequestByBlockType(updateSchema),
    updateBlockFieldController
  )
  .delete(deleteBlockFileController);

router.route("/:id/duplicate").post(duplicateBlockController);

export default router;
