import { z } from "zod";
import {
  baseBlockSchema,
  blockReferenceSchema,
  makeUpdateSchema,
  positionSchema,
  withOptionalConfig,
} from ".";
import { BlockType } from "../../generated/prisma/enum";
import { LongTextBoxSizes } from "../../constants";

// Optional config
const longTextOptionalConfigSchema = z
  .object({
    textBoxSize: z.enum(LongTextBoxSizes).optional(),
    minCharacterLength: z.number().int().nonnegative().nullable().optional(),
    maxCharacterLength: z.number().int().positive().nullable().optional(),
  })
  .refine(
    (data) =>
      data.minCharacterLength == null ||
      data.maxCharacterLength == null ||
      data.minCharacterLength <= data.maxCharacterLength,
    {
      message: "minCharacterLength cannot be greater than maxCharacterLength",
      path: ["minCharacterLength"],
    }
  );

const longTextBlockSchema = withOptionalConfig(longTextOptionalConfigSchema)
  .merge(blockReferenceSchema)
  .extend({
    type: z.literal(BlockType.LONG_TEXT),
  });

// dto
export const createLongTextBlockSchema = z.object({
  body: longTextBlockSchema,
});

export const updateLongTextBlockSchema = z.object({
  body: makeUpdateSchema(longTextBlockSchema, {
    type: z.literal(BlockType.LONG_TEXT),
    newBlockPosition: positionSchema.optional(),
    required: z.boolean().optional(),
  }),
});

// types
export type CreateLongTextBlockDto = z.infer<typeof longTextBlockSchema>;
export type UpdateLongTextBlockDto = z.infer<
  typeof updateLongTextBlockSchema
>["body"];
