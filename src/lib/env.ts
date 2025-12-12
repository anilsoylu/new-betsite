import { z } from "zod";

const envSchema = z.object({
  // Sportmonks API - server-only
  API_SPORTMONKS_KEY: z.string().min(1, "API_SPORTMONKS_KEY is required"),

  // Public site URL
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  // hCaptcha
  NEXT_PUBLIC_HCAPTCHA_SITE_KEY: z.string().optional(),
  HCAPTCHA_SECRET_KEY: z.string().optional(),

  // Bunny CDN
  BUNNY_CDN_URL: z.string().url().optional(),

  // Contentful
  CONTENTFUL_ACCESS_TOKEN: z.string().optional(),
  CONTENTFUL_PREVIEW_ACCESS_TOKEN: z.string().optional(),
  CONTENTFUL_DELIVERY_ACCESS_TOKEN: z.string().optional(),
  CONTENTFUL_SPACE_ID: z.string().optional(),

  // SMTP
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_TO: z.string().email().optional(),

  // Vote Cookie Secret (for HMAC signing anonymous voter IDs)
  VOTE_COOKIE_SECRET: z.string().min(32).optional(),
});

export type Env = z.infer<typeof envSchema>;

function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = getEnv();
