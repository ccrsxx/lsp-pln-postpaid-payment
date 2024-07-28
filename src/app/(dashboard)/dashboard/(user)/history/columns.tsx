'use client';

import { Prisma } from '@prisma/client';
import { formatCurrency, formatDate } from '@/lib/format';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-header';
import { PaymentStatusChip } from '../../payment-status-chip';
import type { ColumnDef } from '@tanstack/react-table';

const paymentWithUser = Prisma.validator<Prisma.PaymentDefaultArgs>()({
  include: {
    user: true,
    bill: true
  }
});

export type PaymentWithUserAndBill = Prisma.PaymentGetPayload<
  typeof paymentWithUser
>;

export const columns: ColumnDef<PaymentWithUserAndBill>[] = [
  {
    accessorKey: 'user',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Name' column={column} />;
    },
    cell: ({
      row: {
        original: {
          user: { name }
        }
      }
    }) => name
  },
  {
    accessorKey: 'accountName',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Account Name' column={column} />;
    },
    cell: ({
      row: {
        original: { accountName }
      }
    }) => accountName
  },
  {
    accessorKey: 'accountNumber',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Account Number' column={column} />;
    },
    cell: ({
      row: {
        original: { accountNumber }
      }
    }) => accountNumber
  },
  {
    accessorKey: 'totalUsageKwh',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Usage' column={column} />;
    },
    cell: ({
      row: {
        original: {
          bill: { totalUsageKwh }
        }
      }
    }) => `${totalUsageKwh} kWh`
  },
  {
    accessorKey: 'totalPrice',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Price' column={column} />;
    },
    cell: ({
      row: {
        original: {
          bill: { totalPrice }
        }
      }
    }) => formatCurrency(totalPrice)
  },
  {
    accessorKey: 'payment',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Status' column={column} />;
    },
    cell: ({
      row: {
        original: { status }
      }
    }): JSX.Element => {
      return <PaymentStatusChip status={status} />;
    }
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Created At' column={column} />;
    },
    cell: ({
      row: {
        original: { createdAt }
      }
    }) => formatDate(createdAt)
  }
];
