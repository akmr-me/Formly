import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const singleSelectOptionalConfigSchema = z.object({
  selectType: z.enum(["single", "multi", "dropdown"]).default("single"),
  options: z.array(z.string()).default([]),
  otherOption: z.boolean().default(false),
  randomize: z.boolean().default(false),
  horizontalAlign: z.boolean().default(false),
  hideLabels: z.boolean().default(false),
  autoFillParam: z.string().optional(),
});

const singleSelectBlockSchema = baseBlockSchema.extend({
  optionalConfig: singleSelectOptionalConfigSchema.optional(),
  type: z.literal(BlockType.SINGLE_SELECT),
  referenceBlockId: z.string(),
  newBlockPosition: z.enum(["before", "after"]).default("after"),
});

export const createSingleSelectBlockSchema = z.object({
  body: singleSelectBlockSchema,
});

export const updateSingleSelectBlockSchema = z.object({
  body: singleSelectBlockSchema.partial().extend({
    type: z.literal(BlockType.SINGLE_SELECT),
    newBlockPosition: z.enum(["before", "after"]).optional(),
  }),
});

type CreateSingleSelectBlockType = z.infer<
  typeof createSingleSelectBlockSchema
>;
type UpdateSingleSelectBlockType = z.infer<
  typeof updateSingleSelectBlockSchema
>;

export type CreateSingleSelectBlockDto = CreateSingleSelectBlockType["body"];
export type UpdateSingleSelectBlockDto = UpdateSingleSelectBlockType["body"];
