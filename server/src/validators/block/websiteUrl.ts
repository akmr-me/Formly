import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const websiteUrlOptionalConfigSchema = z.object({});

const websiteUrlBlockSchema = baseBlockSchema.extend({
  optionalConfig: websiteUrlOptionalConfigSchema.optional(),
  type: z.literal(BlockType.WEBSITE_URL),
  referenceBlockId: z.string(),
  newBlockPosition: z.enum(["before", "after"]).default("after"),
});

export const createWebsiteUrlBlockSchema = z.object({
  body: websiteUrlBlockSchema,
});

export const updateWebsiteUrlBlockSchema = z.object({
  body: websiteUrlBlockSchema.partial().extend({
    type: z.literal(BlockType.WEBSITE_URL),
    // This one is for safty for rewrite base schema
    newBlockPosition: z.enum(["before", "after"]).optional(),
    required: z.boolean().optional(),
  }),
});

type CreateWebsiteUrlBlockType = z.infer<typeof createWebsiteUrlBlockSchema>;
type UpdateWebsiteUrlBlockType = z.infer<typeof updateWebsiteUrlBlockSchema>;

export type CreateWebsiteUrlBlockDto = CreateWebsiteUrlBlockType["body"];
export type UpdateWebsiteUrlBlockDto = UpdateWebsiteUrlBlockType["body"];
