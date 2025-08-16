import { z } from "zod";
import {
  baseBlockSchema,
  blockReferenceSchema,
  makeUpdateSchema,
  positionSchema,
  withOptionalConfig,
} from ".";
import { BlockType } from "../../generated/prisma/enum";

const websiteUrlOptionalConfigSchema = z.object({});

const websiteUrlBlockSchema = withOptionalConfig(websiteUrlOptionalConfigSchema)
  .merge(blockReferenceSchema)
  .extend({
    type: z.literal(BlockType.WEBSITE_URL),
  });

// dto
export const createWebsiteUrlBlockSchema = z.object({
  body: websiteUrlBlockSchema,
});

export const updateWebsiteUrlBlockSchema = z.object({
  body: makeUpdateSchema(websiteUrlBlockSchema, {
    type: z.literal(BlockType.WEBSITE_URL),
    required: z.boolean().optional(),
    newBlockPosition: positionSchema.optional(),
  }),
});

// type
export type CreateWebsiteUrlBlockDto = z.infer<typeof websiteUrlBlockSchema>;
export type UpdateWebsiteUrlBlockDto = z.infer<
  typeof updateWebsiteUrlBlockSchema
>["body"];
