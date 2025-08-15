import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const addressFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  visible: z.boolean().default(true),
  width: z.enum(["half", "full"]),
  order: z.number(),
});

export const addressOptionalConfigSchema = z.object({
  address: addressFieldSchema,
  addressLine2: addressFieldSchema,
  city: addressFieldSchema,
  state: addressFieldSchema,
  zip: addressFieldSchema,
  country: addressFieldSchema,
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

export const updateAddressOptionalConfigSchema = z.object({
  address: addressFieldSchema.optional(),
  addressLine2: addressFieldSchema.optional(),
  city: addressFieldSchema.optional(),
  state: addressFieldSchema.optional(),
  zip: addressFieldSchema.optional(),
  country: addressFieldSchema.optional(),
});

export const updateAddressBlockSchema = z.object({
  body: addressBlockSchema.partial().extend({
    optionalConfig: updateAddressOptionalConfigSchema.optional(),
    type: z.literal(BlockType.ADDRESS),
    // This one is for safty for rewrite base schema
    newBlockPosition: z.enum(["before", "after"]).optional(),
    required: z.boolean().optional(),
  }),
});

type CreateAddressBlockType = z.infer<typeof createAddressBlockSchema>;
type UpdateAddressBlockType = z.infer<typeof updateAddressBlockSchema>;

export type CreateAddressBlockDto = CreateAddressBlockType["body"];
export type UpdateAddressBlockDto = UpdateAddressBlockType["body"];
