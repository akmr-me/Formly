import { z } from "zod";
import {
  baseBlockSchema,
  makeUpdateSchema,
  positionSchema,
  withOptionalConfig,
} from ".";
import { BlockType } from "../../generated/prisma/enum";

const statementOptionalConfigSchema = z.object({
  embed: z.string().default(""),
});

const statementBlockSchema = withOptionalConfig(
  statementOptionalConfigSchema
).extend({
  type: z.literal(BlockType.STATEMENT),
});

// dto
export const createStatementBlockSchema = z.object({
  body: statementBlockSchema,
});

export const updateStatementBlockSchema = z.object({
  body: makeUpdateSchema(statementBlockSchema, {
    type: z.literal(BlockType.STATEMENT),
    newBlockPosition: positionSchema.optional(),
  }),
});

// types
export type CreateStatementBlockDto = z.infer<typeof statementBlockSchema>;
export type UpdateStatementBlockDto = z.infer<
  typeof updateStatementBlockSchema
>["body"];
