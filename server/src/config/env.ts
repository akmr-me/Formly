import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.url(),
  ASSETS_BASE_URL: z.url(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
