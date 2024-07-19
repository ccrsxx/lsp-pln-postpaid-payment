import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_URL: z.string().trim().min(1),
  NEXT_PUBLIC_DOMAIN_URL: z.string().trim().min(1).optional(),
  NEXT_PUBLIC_VERCEL_URL: z.string().trim().min(1).optional(),
  NEXT_PUBLIC_BACKEND_URL: z.string().trim().min(1)
});

const parsedSchema = envSchema.parse({
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_DOMAIN_URL: process.env.NEXT_PUBLIC_DOMAIN_URL,
  NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL
});

export const {
  NEXT_PUBLIC_URL,
  NEXT_PUBLIC_DOMAIN_URL,
  NEXT_PUBLIC_VERCEL_URL,
  NEXT_PUBLIC_BACKEND_URL
} = parsedSchema;
