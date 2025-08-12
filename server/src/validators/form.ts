import { z } from "zod";

export const createFormSchema = z.object({
  body: z.object({}).default({}),
});

type CreateFormType = z.infer<typeof createFormSchema>;

export type CreateFormDto = CreateFormType["body"];
