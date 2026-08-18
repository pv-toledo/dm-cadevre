import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  DIRECT_URL: z.string().min(1),
});

const parsed = envSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
});

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`
  );
}

export const env = parsed.data;