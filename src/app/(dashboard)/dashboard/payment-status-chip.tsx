import { cn } from '@/lib/utils';
import type { PaymentStatus } from '@prisma/client';

type CustomStatus = 'UNPAID' | PaymentStatus;

type PaymentStatusChipProps = {
  status: PaymentStatus | null;
};

export function PaymentStatusChip({
  status
}: PaymentStatusChipProps): JSX.Element {
  const paymentStatus: CustomStatus = status ?? 'UNPAID';

  return (
    <div
      className={cn('mr-auto w-fit rounded p-2', {
        'bg-accent': paymentStatus === 'UNPAID',
        'bg-red-500': paymentStatus === 'REJECTED',
        'bg-blue-500': paymentStatus === 'PENDING',
        'bg-green-500': paymentStatus === 'COMPLETED'
      })}
    >
      {paymentStatus}
    </div>
  );
}
