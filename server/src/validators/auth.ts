import { z } from "zod";

export const authCredentialsSchema = z.object({
  body: z.object({
    email: z.string().email().transform((email) => email.toLowerCase()),
    password: z.string().min(8),
  }),
});

type AuthCredentialsSchema = z.infer<typeof authCredentialsSchema>;

export type AuthCredentialsDto = AuthCredentialsSchema["body"];
