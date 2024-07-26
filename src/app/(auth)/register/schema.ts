import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(3),
  email: z.string().email(),
  password: z.string().trim().min(8)
});

export type RegisterSchema = z.infer<typeof registerSchema>;
