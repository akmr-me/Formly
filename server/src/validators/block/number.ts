import { z } from "zod";
import {
  baseBlockSchema,
  blockReferenceSchema,
  makeUpdateSchema,
  positionSchema,
  withOptionalConfig,
} from ".";
import { BlockType } from "../../generated/prisma/enum";

const numberOptionalConfigSchema = z
  .object({
    minimumNumber: z.number().optional().nullable(),
    maximumNumber: z.number().optional().nullable(),
  })
  .refine(
    (data) =>
      data.minimumNumber == null ||
      data.maximumNumber == null ||
      data.minimumNumber <= data.maximumNumber,
    {
      message: "minimumNumber cannot be greater than maximumNumber",
      path: ["minimumNumber"],
    }
  );

const numberBlockSchema = withOptionalConfig(numberOptionalConfigSchema)
  .merge(blockReferenceSchema)
  .extend({
    type: z.literal(BlockType.NUMBER),
  });

// dto
export const createNumberBlockSchema = z.object({
  body: numberBlockSchema,
});

export const updateNumberBlockSchema = z.object({
  body: makeUpdateSchema(numberBlockSchema, {
    type: z.literal(BlockType.NUMBER),
    required: z.boolean().optional(),
    newBlockPosition: positionSchema.optional(),
  }),
});

// dto
export type CreateNumberBlockDto = z.infer<typeof numberBlockSchema>;
export type UpdateNumberBlockDto = z.infer<
  typeof updateNumberBlockSchema
>["body"];
