import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const statementBlockSchema = baseBlockSchema.extend({
  required: z.boolean().default(false),
  embededUrl: z.url().optional(),
  descriptionDelta: z.object({}).optional(),
  descriptionHtml: z.string().optional(),
  coverImageOrigin: z.string().optional(),
  coverImagePath: z.string().optional(),
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
