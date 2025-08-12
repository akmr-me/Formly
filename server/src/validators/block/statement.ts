import { z } from "zod";
import { AlignType, BlockType } from "../../generated/prisma/enum";

export const createStatementBlockSchema = z.object({
  body: z.object({
    type: z.literal(BlockType.STATEMENT),
    title: z.string().min(1).max(255).trim(),
    titleLabel: z.string().min(1).max(255).trim(),
    textAlign: z.literal(AlignType.CENTER),
    buttonText: z.string().min(1).max(255).trim(),
    formId: z.string().length(8),
  }),
});

type CreateStatementBlockType = z.infer<typeof createStatementBlockSchema>;

export type CreateStatementBlockDto = CreateStatementBlockType["body"];
