import { z } from "zod";
import { baseBlockSchema } from ".";
import { BlockType } from "../../generated/prisma/enum";

const dropdownOptionalConfigSchema = z.object({
  selectType: z.enum(["single", "multi", "dropdown"]).default("dropdown"),
  options: z.array(z.string()).default([]),
  randomize: z.boolean().default(false),
  selectionLimit: z
    .object({
      mode: z.enum(["unlimited", "exact", "range"]),
      exactNumber: z.number().optional(),
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  autoFillParam: z.string().optional(),
});

const dropdownBlockSchema = baseBlockSchema.extend({
  optionalConfig: dropdownOptionalConfigSchema.optional(),
  type: z.literal(BlockType.DROPDOWN),
  referenceBlockId: z.string(),
  newBlockPosition: z.enum(["before", "after"]).default("after"),
});

export const createDropdownBlockSchema = z.object({
  body: dropdownBlockSchema,
});

export const updateDropdownBlockSchema = z.object({
  body: dropdownBlockSchema.partial().extend({
    type: z.literal(BlockType.DROPDOWN),
    newBlockPosition: z.enum(["before", "after"]).optional(),
  }),
});

type CreateDropdownBlockType = z.infer<typeof createDropdownBlockSchema>;
type UpdateDropdownBlockType = z.infer<typeof updateDropdownBlockSchema>;

export type CreateDropdownBlockDto = CreateDropdownBlockType["body"];
export type UpdateDropdownBlockDto = UpdateDropdownBlockType["body"];
