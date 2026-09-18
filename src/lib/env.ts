import { z } from "zod";

const envSchema = z.object({
  SUPABASE_URL:z.url(),
  DATABASE_URL: z.url(),
  DIRECT_URL: z.string().min(1),
  SECRET_KEY: z.string().min(1)
});

const parsed = envSchema.safeParse({
  SUPABASE_URL: process.env.SUPABASE_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  SECRET_KEY:process.env.SECRET_KEY
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`
  );
}

export const env = parsed.data;