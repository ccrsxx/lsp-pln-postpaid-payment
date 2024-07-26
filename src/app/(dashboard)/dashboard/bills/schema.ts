import { z } from 'zod';

export const createPaymentSchema = z.object({
  accountName: z.string().trim().min(3),
  accountNumber: z.string().trim().min(3)
});

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;
