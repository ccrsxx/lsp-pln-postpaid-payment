import { cn } from '@/lib/utils';
import type { PaymentStatus } from '@prisma/client';

export type CustomPaymentStatus = 'UNPAID' | 'EXPIRED' | PaymentStatus;

type PaymentStatusChipProps = {
  status: CustomPaymentStatus | null;
};

export function PaymentStatusChip({
  status
}: PaymentStatusChipProps): JSX.Element {
  const paymentStatus: CustomPaymentStatus = status ?? 'UNPAID';

  return (
    <div
      className={cn('mr-auto w-fit rounded p-2', {
        'bg-accent': paymentStatus === 'UNPAID',
        'bg-red-500': paymentStatus === 'REJECTED',
        'bg-blue-500': paymentStatus === 'PENDING',
        'bg-green-500': paymentStatus === 'COMPLETED',
        'bg-yellow-500': paymentStatus === 'EXPIRED'
      })}
    >
      {paymentStatus}
    </div>
  );
}
