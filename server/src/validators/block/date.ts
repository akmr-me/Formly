import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const dateOptionalConfigSchema = z.object({
  autoFillParam: z.string().optional(),
});

const dateBlockSchema = baseBlockSchema.extend({
  optionalConfig: dateOptionalConfigSchema.optional(),
  type: z.literal(BlockType.DATE),
  referenceBlockId: z.string(),
  newBlockPosition: z.enum(["before", "after"]).default("after"),
});

export const createDateBlockSchema = z.object({
  body: dateBlockSchema,
});

export const updateDateBlockSchema = z.object({
  body: dateBlockSchema.partial().extend({
    type: z.literal(BlockType.DATE),
    newBlockPosition: z.enum(["before", "after"]).optional(),
  }),
});

type CreateDateBlockType = z.infer<typeof createDateBlockSchema>;
type UpdateDateBlockType = z.infer<typeof updateDateBlockSchema>;

export type CreateDateBlockDto = CreateDateBlockType["body"];
export type UpdateDateBlockDto = UpdateDateBlockType["body"];
