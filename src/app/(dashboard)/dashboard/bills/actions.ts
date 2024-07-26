import { sleep } from '@/lib/helper';
import type { ActionsResponse } from '@/lib/types/api';
import type { CreatePaymentSchema } from './schema';

export async function createPayment(
  formData: CreatePaymentSchema
): Promise<ActionsResponse> {
  await sleep(1000);

  return { success: 'Payment created successfully' };
}
