import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const longTextOptionalConfigSchema = z.object({
  placeholder: z.string().default(""),
  textBoxSize: z
    .enum(["small", "medium", "large", "extraLarge"])
    .default("medium"),
  minCharacterLength: z.number().int().nonnegative().optional(),
  maxCharacterLength: z.number().int().positive().optional(),
});

const longTextBlockSchema = baseBlockSchema.extend({
  optionalConfig: longTextOptionalConfigSchema.optional(),
  type: z.literal(BlockType.LONG_TEXT),
  referenceBlockId: z.string(),
  newBlockPosition: z.enum(["before", "after"]).default("after"),
});

export const createLongTextBlockSchema = z.object({
  body: longTextBlockSchema,
});

export const updateLongTextBlockSchema = z.object({
  body: longTextBlockSchema.partial().extend({
    type: z.literal(BlockType.LONG_TEXT),
    newBlockPosition: z.enum(["before", "after"]).optional(),
  }),
});

type CreateLongTextBlockType = z.infer<typeof createLongTextBlockSchema>;
type UpdateLongTextBlockType = z.infer<typeof updateLongTextBlockSchema>;

export type CreateLongTextBlockDto = CreateLongTextBlockType["body"];
export type UpdateLongTextBlockDto = UpdateLongTextBlockType["body"];
