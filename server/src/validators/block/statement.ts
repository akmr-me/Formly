import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const optionalConfigSchema = z.object({
  embed: z.string().default(""),
});

const statementBlockSchema = baseBlockSchema.extend({
  optionalConfig: optionalConfigSchema.optional(),
  type: z.literal(BlockType.STATEMENT),
});

export const createStatementBlockSchema = z.object({
  body: statementBlockSchema,
});

export const updateStatementBlockSchema = z.object({
  body: statementBlockSchema.partial().extend({
    type: z.literal(BlockType.STATEMENT),
  }),
});

type CreateStatementBlockType = z.infer<typeof createStatementBlockSchema>;
type UpdateStatementBlockType = z.infer<typeof updateStatementBlockSchema>;

export type CreateStatementBlockDto = CreateStatementBlockType["body"];
export type UpdateStatementBlockDto = UpdateStatementBlockType["body"];

// const statementOptionalConfigSchema = z.object({
//   embed: z.string().default(""),
// });

// const statementBlockSchema = baseBlockSchema.extend({
//   optionalConfig: statementOptionalConfigSchema.optional(),
//   type: z.literal(BlockType.STATEMENT),
//   referenceBlockId: z.string(),
//   newBlockPosition: z.enum(["before", "after"]).default("after"),
// });

// export const createStatementBlockSchema = z.object({
//   body: statementBlockSchema,
// });

// export const updateStatementBlockSchema = z.object({
//   body: statementBlockSchema.partial().extend({
//     type: z.literal(BlockType.STATEMENT),
//     newBlockPosition: z.enum(["before", "after"]).optional(),
//   }),
// });

// type CreateStatementBlockType = z.infer<typeof createStatementBlockSchema>;
// type UpdateStatementBlockType = z.infer<typeof updateStatementBlockSchema>;

// export type CreateStatementBlockDto = CreateStatementBlockType["body"];
// export type UpdateStatementBlockDto = UpdateStatementBlockType["body"];
