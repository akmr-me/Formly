import { z } from "zod";
import {
  baseBlockSchema,
  blockReferenceSchema,
  makeUpdateSchema,
  positionSchema,
  withOptionalConfig,
} from ".";
import { BlockType } from "../../generated/prisma/enum";

const shortTextOptionalConfigSchema = z
  .object({
    placeholder: z.string().default(""),
    textBoxSize: z
      .enum(["small", "medium", "large", "extraLarge"])
      .default("medium"),
    minChars: z.number().int().nonnegative().optional(),
    maxChars: z.number().int().positive().optional(),
  })
  .refine(
    (data) =>
      data.minChars == null ||
      data.maxChars == null ||
      data.minChars <= data.maxChars,
    {
      message: "minChars cannot be greater than maxChars",
      path: ["minChars"],
    }
  );

const shortTextBlockSchema = withOptionalConfig(shortTextOptionalConfigSchema)
  .merge(blockReferenceSchema)
  .extend({
    type: z.literal(BlockType.SHORT_TEXT),
  });

export const createShortTextBlockSchema = z.object({
  body: shortTextBlockSchema,
});

export const updateShortTextBlockSchema = z.object({
  body: makeUpdateSchema(shortTextBlockSchema, {
    type: z.literal(BlockType.SHORT_TEXT),
    required: z.boolean().optional(),
    newBlockPosition: positionSchema.optional(),
  }),
});

// Types
export type CreateShortTextBlockDto = z.infer<typeof shortTextBlockSchema>;
export type UpdateShortTextBlockDto = z.infer<
  typeof updateShortTextBlockSchema
>["body"];
