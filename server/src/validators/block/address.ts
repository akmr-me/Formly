import { z } from "zod";
import {
  baseBlockSchema,
  blockReferenceSchema,
  makeUpdateSchema,
  positionSchema,
  withOptionalConfig,
} from ".";
import { BlockType } from "../../generated/prisma/enum";
import { AddressFieldSizes } from "../../constants";

const addressFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  visible: z.boolean().default(true),
  width: z.enum(AddressFieldSizes),
  order: z.number(),
});

//

export const addressOptionalConfigSchema = z.object({
  address: addressFieldSchema,
  addressLine2: addressFieldSchema,
  city: addressFieldSchema,
  state: addressFieldSchema,
  zip: addressFieldSchema,
  country: addressFieldSchema,
});

const addressBlockSchema = withOptionalConfig(addressOptionalConfigSchema)
  .merge(blockReferenceSchema)
  .extend({
    type: z.literal(BlockType.ADDRESS),
  });

// dto
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
  body: makeUpdateSchema(addressBlockSchema, {
    optionalConfig: updateAddressOptionalConfigSchema.optional(),
    type: z.literal(BlockType.ADDRESS),
    required: z.boolean().optional(),
    newBlockPosition: positionSchema.optional(),
  }),
});

export type CreateAddressBlockDto = z.infer<typeof addressBlockSchema>;
export type UpdateAddressBlockDto = z.infer<
  typeof updateAddressBlockSchema
>["body"];
