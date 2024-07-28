'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import {
  createPaymentActionsSchema,
  type CreatePaymentActionsSchema
} from './schema';
import type { ActionsResponse } from '@/lib/types/api';

export async function createPayment(
  formData: CreatePaymentActionsSchema
): Promise<ActionsResponse> {
  const { data, success } = createPaymentActionsSchema.safeParse(formData);

  if (!success) return { error: 'Invalid form data' };

  const { userId, billId, accountName, accountNumber } = data;

  const paymentAlreadyExist = await prisma.payment.findFirst({
    where: {
      billId
    }
  });

  if (paymentAlreadyExist) {
    return { error: 'Payment already exists for this bill' };
  }

  await prisma.payment.create({
    data: {
      userId,
      billId,
      status: 'PENDING',
      accountName,
      accountNumber
    }
  });

  revalidatePath('/dashboard/bills');

  return { success: 'Payment created successfully' };
}
