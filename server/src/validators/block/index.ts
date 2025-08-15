import { z } from "zod";
import {
  AlignType,
  BlockType,
  CoverImageLayout,
} from "../../generated/prisma/enum";

export const baseBlockSchema = z.object({
  type: z.enum(BlockType),
  title: z.string().min(0).max(255).trim(),
  titleLabel: z.string().min(0).max(255).trim(),
  textAlign: z.enum(AlignType),
  buttonText: z.string().min(0).max(255).trim(),
  formId: z.string().length(8),
  position: z.float32().optional(),
  // Optionals
  required: z.boolean().default(false),
  optionalConfig: z.object({}).optional(),
  descriptionDelta: z.object({}).optional(),
  descriptionHtml: z.string().optional(),
  coverImageOrigin: z.string().optional(),
  coverImagePath: z.string().optional(),
  coverImageLayout: z.enum(CoverImageLayout).optional(),
  placeholder: z.string().optional(),
  urlParameter: z.string().optional(),
  // Positional keys
  referenceBlockId: z.string().optional(),
  newBlockPosition: z.enum(["before", "after"]).optional(),
});

// // Example: Signup schema adds a password field
// const signupSchema = baseUserSchema.extend({
//   password: z.string().min(8, "Password must be at least 8 characters"),
// });

// // Example: Profile update schema adds optional fields
// const profileUpdateSchema = baseUserSchema.partial().extend({
//   bio: z.string().max(200).optional(),
// });

// const addressSchema = z.object({
//   city: z.string(),
//   zip: z.string(),
// });
