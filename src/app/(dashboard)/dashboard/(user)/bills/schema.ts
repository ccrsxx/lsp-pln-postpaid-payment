import { z } from 'zod';

export const createPaymentSchema = z.object({
  accountName: z.string().trim().min(3),
  accountNumber: z.coerce
    .number()
    .int()
    .min(100_000)
    .max(999_999_999)
    .transform(String)
});

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;

export const createPaymentActionsSchema = createPaymentSchema.extend({
  userId: z.string().uuid(),
  billId: z.string().uuid()
});

export type CreatePaymentActionsSchema = z.infer<
  typeof createPaymentActionsSchema
>;
