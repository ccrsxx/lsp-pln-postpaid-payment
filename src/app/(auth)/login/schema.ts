import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8)
});

export type LoginSchema = z.infer<typeof loginSchema>;
