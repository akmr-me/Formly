import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(8000),
  DATABASE_URL: z.url(),
  ASSETS_BASE_URL: z.url(),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  JWT_SECRET: z.string().min(32),
  AUTH_COOKIE_NAME: z.string().default("formly_auth"),
  AUTH_COOKIE_MAX_AGE_DAYS: z.coerce.number().default(30),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
