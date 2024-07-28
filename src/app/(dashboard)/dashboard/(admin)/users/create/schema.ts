import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().trim().min(3),
  email: z.string().email(),
  password: z.string().trim().min(8),
  rateVariant: z.string().trim().min(6)
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
