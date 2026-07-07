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
import {
  createShortTextBlockSchema,
  updateShortTextBlockSchema,
} from "../validators/block/shortText";
import { upload } from "../middlewares/multer";
import {
  createLongTextBlockSchema,
  updateLongTextBlockSchema,
} from "../validators/block/longText";
import {
  createNumberBlockSchema,
  updateNumberBlockSchema,
} from "../validators/block/number";
import {
  createAddressBlockSchema,
  updateAddressBlockSchema,
} from "../validators/block/address";
import {
  createDateBlockSchema,
  updateDateBlockSchema,
} from "../validators/block/date";
import {
  createWebsiteUrlBlockSchema,
  updateWebsiteUrlBlockSchema,
} from "../validators/block/websiteUrl";
import {
  createSingleSelectBlockSchema,
  updateSingleSelectBlockSchema,
} from "../validators/block/singleSelect";
import {
  createMultiSelectBlockSchema,
  updateMultiSelectBlockSchema,
} from "../validators/block/multiSelect";
import {
  createDropdownBlockSchema,
  updateDropdownBlockSchema,
} from "../validators/block/dropdownList";
import { authenticate } from "../middlewares/auth";
import {
  requireBlockOwnerById,
  requireFormOwnerByShortId,
} from "../middlewares/ownership";

const router = Router();

const schemas = {
  statement: createStatementBlockSchema,
  shortText: createShortTextBlockSchema,
  longText: createLongTextBlockSchema,
  number: createNumberBlockSchema,
  date: createDateBlockSchema,
  websiteUrl: createWebsiteUrlBlockSchema,
  address: createAddressBlockSchema,
  single: createSingleSelectBlockSchema,
  multi: createMultiSelectBlockSchema,
  dropdown: createDropdownBlockSchema,
};

const updateSchema = {
  statement: updateStatementBlockSchema,
  shortText: updateShortTextBlockSchema,
  longText: updateLongTextBlockSchema,
  number: updateNumberBlockSchema,
  date: updateDateBlockSchema,
  websiteUrl: updateWebsiteUrlBlockSchema,
  address: updateAddressBlockSchema,
  single: updateSingleSelectBlockSchema,
  multi: updateMultiSelectBlockSchema,
  dropdown: updateDropdownBlockSchema,
};

router.post(
  "/",
  authenticate,
  // @ts-ignore
  filterRequestByBlockType(schemas),
  requireFormOwnerByShortId,
  createBlockController
);

router
  .route("/:id")
  .get(authenticate, requireBlockOwnerById, getBlockByIdController)
  .patch(
    authenticate,
    requireBlockOwnerById,
    filterRequestByBlockType(updateSchema),
    updateBlockFieldController
  )
  .delete(authenticate, requireBlockOwnerById, deleteBlockController);

router
  .route("/:id/upload")
  .patch(
    authenticate,
    requireBlockOwnerById,
    upload.single("file"),
    filterRequestByBlockType(updateSchema),
    updateBlockFieldController
  )
  .delete(authenticate, requireBlockOwnerById, deleteBlockFileController);

router
  .route("/:id/duplicate")
  .post(authenticate, requireBlockOwnerById, duplicateBlockController);

export default router;
