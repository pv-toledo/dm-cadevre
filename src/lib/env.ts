import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  DATABASE_URL: z.url(),
  DIRECT_URL: z.string().min(1),
  NEXT_PUBLIC_SECRET_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NEXT_PUBLIC_SECRET_KEY: process.env.NEXT_PUBLIC_SECRET_KEY,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables: ${parsed.error.issues
      .map((issue) => issue.path.join("."))
      .join(", ")}`
  );
}

export const env = parsed.data;