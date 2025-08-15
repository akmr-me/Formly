import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const addressOptionalConfigSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

const addressBlockSchema = baseBlockSchema.extend({
  optionalConfig: addressOptionalConfigSchema.optional(),
  type: z.literal(BlockType.ADDRESS),
  referenceBlockId: z.string(),
  newBlockPosition: z.enum(["before", "after"]).default("after"),
});

export const createAddressBlockSchema = z.object({
  body: addressBlockSchema,
});

export const updateAddressBlockSchema = z.object({
  body: addressBlockSchema.partial().extend({
    type: z.literal(BlockType.ADDRESS),
    newBlockPosition: z.enum(["before", "after"]).optional(),
  }),
});

type CreateAddressBlockType = z.infer<typeof createAddressBlockSchema>;
type UpdateAddressBlockType = z.infer<typeof updateAddressBlockSchema>;

export type CreateAddressBlockDto = CreateAddressBlockType["body"];
export type UpdateAddressBlockDto = UpdateAddressBlockType["body"];
