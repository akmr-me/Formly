import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const numberOptionalConfigSchema = z.object({
  placeholder: z.string().default(""),
  minNumber: z.number().optional(),
  autoFillParam: z.string().optional(),
});

const numberBlockSchema = baseBlockSchema.extend({
  optionalConfig: numberOptionalConfigSchema.optional(),
  type: z.literal(BlockType.NUMBER),
  referenceBlockId: z.string(),
  newBlockPosition: z.enum(["before", "after"]).default("after"),
});

export const createNumberBlockSchema = z.object({
  body: numberBlockSchema,
});

export const updateNumberBlockSchema = z.object({
  body: numberBlockSchema.partial().extend({
    type: z.literal(BlockType.NUMBER),
    newBlockPosition: z.enum(["before", "after"]).optional(),
  }),
});

type CreateNumberBlockType = z.infer<typeof createNumberBlockSchema>;
type UpdateNumberBlockType = z.infer<typeof updateNumberBlockSchema>;

export type CreateNumberBlockDto = CreateNumberBlockType["body"];
export type UpdateNumberBlockDto = UpdateNumberBlockType["body"];
