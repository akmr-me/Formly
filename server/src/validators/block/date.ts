import { z } from "zod";
import {
  baseBlockSchema,
  blockReferenceSchema,
  makeUpdateSchema,
  positionSchema,
  withOptionalConfig,
} from ".";
import { BlockType } from "../../generated/prisma/enum";

const dateOptionalConfigSchema = z.object({
  autoFillParam: z.string().optional(),
});

const dateBlockSchema = withOptionalConfig(dateOptionalConfigSchema)
  .merge(blockReferenceSchema)
  .extend({
    type: z.literal(BlockType.DATE),
  });

// dto
export const createDateBlockSchema = z.object({
  body: dateBlockSchema,
});

export const updateDateBlockSchema = z.object({
  body: makeUpdateSchema(dateBlockSchema, {
    type: z.literal(BlockType.DATE),
    required: z.boolean().optional(),
    newBlockPosition: positionSchema.optional(),
  }),
});

// type
export type CreateDateBlockDto = z.infer<typeof dateBlockSchema>;
export type UpdateDateBlockDto = z.infer<typeof updateDateBlockSchema>["body"];
