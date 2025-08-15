import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const shortTextOptionalConfigSchema = z.object({
  placeholder: z.string().default(""),
  textBoxSize: z
    .enum(["small", "medium", "large", "extraLarge"])
    .default("medium"),
  minChars: z.number().int().nonnegative().optional(),
  maxChars: z.number().int().positive().optional(),
});

const shortTextBlockSchema = baseBlockSchema.extend({
  optionalConfig: shortTextOptionalConfigSchema.optional(),
  type: z.literal(BlockType.SHORT_TEXT),
  referenceBlockId: z.string(),
  newBlockPosition: z.enum(["before", "after"]).default("after"),
});

export const createShortTextBlockSchema = z.object({
  body: shortTextBlockSchema,
});

export const updateShortTextBlockSchema = z.object({
  body: shortTextBlockSchema.partial().extend({
    type: z.literal(BlockType.SHORT_TEXT),
    // This one is for safty for rewrite base schema
    newBlockPosition: z.enum(["before", "after"]).optional(),
    required: z.boolean().optional(),
  }),
});

// /
// const shortTextOptionalConfigSchema = z.object({
//   placeholder: z.string().default(""),
//   textBoxSize: z
//     .enum(["small", "medium", "large", "extraLarge"])
//     .default("medium"),
//   minChars: z.number().int().nonnegative().optional(),
//   maxChars: z.number().int().positive().optional(),
// });

// const shortTextBlockSchema = baseBlockSchema.extend({
//   optionalConfig: shortTextOptionalConfigSchema.optional(),
//   type: z.literal(BlockType.SHORT_TEXT),
//   referenceBlockId: z.string(),
//   newBlockPosition: z.enum(["before", "after"]).default("after"),
// });

// export const createShortTextBlockSchema = z.object({
//   body: shortTextBlockSchema,
// });

// export const updateShortTextBlockSchema = z.object({
//   body: shortTextBlockSchema.partial().extend({
//     type: z.literal(BlockType.SHORT_TEXT),
//     newBlockPosition: z.enum(["before", "after"]).optional(),
//   }),
// });

type CreateShortTextBlockType = z.infer<typeof createShortTextBlockSchema>;
type UpdateShortTextBlockType = z.infer<typeof updateShortTextBlockSchema>;

export type CreateShortTextBlockDto = CreateShortTextBlockType["body"];
export type UpdateShortTextBlockDto = UpdateShortTextBlockType["body"];
