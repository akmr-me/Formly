import { z } from "zod";
import {
  AlignType,
  BlockType,
  CoverImageLayout,
} from "../../generated/prisma/enum";
import { BlockPostions } from "../../constants";

// positional schema
export const positionSchema = z.enum(BlockPostions);

export const blockReferenceSchema = z.object({
  referenceBlockId: z.string(),
  newBlockPosition: positionSchema.default("after"),
});

// Helpers
export const withOptionalConfig = <T extends z.ZodTypeAny>(schema: T) =>
  baseBlockSchema.extend({
    optionalConfig: schema.optional(),
  });

export const makeUpdateSchema = <T extends z.ZodObject<any>>(
  schema: T,
  overrides: Record<string, any>
) => schema.partial().extend(overrides);

export const baseBlockSchema = z.object({
  type: z.enum(BlockType),
  title: z.string().min(0).max(255).trim(),
  titleLabel: z.string().min(0).max(255).trim(),
  textAlign: z.enum(AlignType),
  buttonText: z.string().min(0).max(255).trim(),
  formId: z.string().length(8),
  position: z.float32().optional(),

  // optionals
  required: z.boolean().default(false),
  descriptionDelta: z.object({}).optional(),
  descriptionHtml: z.string().optional(),
  coverImageOrigin: z.string().optional(),
  coverImagePath: z.string().optional(),
  coverImageLayout: z.enum(CoverImageLayout).optional(),
  placeholder: z.string().optional(),
  urlParameter: z.string().optional(),

  optionalConfig: z.object({}).optional(),

  // postion
  referenceBlockId: z.string().optional(),
  newBlockPosition: positionSchema.optional(),
});

// export const baseBlockSchema = z.object({
//   type: z.enum(BlockType),
//   title: z.string().min(0).max(255).trim(),
//   titleLabel: z.string().min(0).max(255).trim(),
//   textAlign: z.enum(AlignType),
//   buttonText: z.string().min(0).max(255).trim(),
//   formId: z.string().length(8),
//   position: z.float32().optional(),
//   // Optionals
//   required: z.boolean().default(false),
//   optionalConfig: z.object({}).optional(),
//   descriptionDelta: z.object({}).optional(),
//   descriptionHtml: z.string().optional(),
//   coverImageOrigin: z.string().optional(),
//   coverImagePath: z.string().optional(),
//   coverImageLayout: z.enum(CoverImageLayout).optional(),
//   placeholder: z.string().optional(),
//   urlParameter: z.string().optional(),
//   // Positional keys
//   referenceBlockId: z.string().optional(),
//   newBlockPosition: z.enum(["before", "after"]).optional(),
// });
