import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const multiSelectOptionalConfigSchema = z.object({
  selectType: z.enum(["single", "multi", "dropdown"]).default("multi"),
  options: z.array(z.string()).default([]),
  otherOption: z.boolean().default(false),
  randomize: z.boolean().default(false),
  horizontalAlign: z.boolean().default(false),
  hideLabels: z.boolean().default(false),
  selectionLimit: z
    .object({
      mode: z.enum(["unlimited", "exact", "range"]),
      exactNumber: z.number().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  autoFillParam: z.string().optional(),
});

const multiSelectBlockSchema = baseBlockSchema.extend({
  optionalConfig: multiSelectOptionalConfigSchema.optional(),
  type: z.literal(BlockType.MULTI_SELECT),
  referenceBlockId: z.string(),
  newBlockPosition: z.enum(["before", "after"]).default("after"),
});

export const createMultiSelectBlockSchema = z.object({
  body: multiSelectBlockSchema,
});

export const updateMultiSelectBlockSchema = z.object({
  body: multiSelectBlockSchema.partial().extend({
    type: z.literal(BlockType.MULTI_SELECT),
    newBlockPosition: z.enum(["before", "after"]).optional(),
  }),
});

type CreateMultiSelectBlockType = z.infer<typeof createMultiSelectBlockSchema>;
type UpdateMultiSelectBlockType = z.infer<typeof updateMultiSelectBlockSchema>;

export type CreateMultiSelectBlockDto = CreateMultiSelectBlockType["body"];
export type UpdateMultiSelectBlockDto = UpdateMultiSelectBlockType["body"];
