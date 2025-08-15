import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const numberOptionalConfigSchema = z.object({
  minimumNumber: z.number().optional(),
  maximumNumber: z.number().optional(),
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
    // This one is for safty for rewrite base schema
    newBlockPosition: z.enum(["before", "after"]).optional(),
    required: z.boolean().optional(),
  }),
});

type CreateNumberBlockType = z.infer<typeof createNumberBlockSchema>;
type UpdateNumberBlockType = z.infer<typeof updateNumberBlockSchema>;

export type CreateNumberBlockDto = CreateNumberBlockType["body"];
export type UpdateNumberBlockDto = UpdateNumberBlockType["body"];
