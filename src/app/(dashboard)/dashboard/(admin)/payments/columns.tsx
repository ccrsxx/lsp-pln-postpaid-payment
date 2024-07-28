'use client';

import { Prisma } from '@prisma/client';
import { useModal } from '@/lib/hooks/use-modal';
import { formatCurrency, formatDate } from '@/lib/format';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-header';
import { DataTableAction } from '@/components/ui/table/data-table-action';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { PaymentStatusChip } from '../../payment-status-chip';
import { ValidatePaymentDialog } from './validate-payment-dialog';
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
    accessorKey: 'user',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Email' column={column} />;
    },
    cell: ({
      row: {
        original: {
          user: { email }
        }
      }
    }) => email
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
  },
  {
    id: 'actions',
    cell: ({ row }): JSX.Element => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { open, openModal, closeModal } = useModal();

      return (
        <>
          <ValidatePaymentDialog
            open={open}
            payment={row.original}
            closeModal={closeModal}
          />
          <DataTableAction row={row} disableActions>
            <DropdownMenuItem onClick={openModal}>
              Validate payment
            </DropdownMenuItem>
          </DataTableAction>
        </>
      );
    }
  }
];
