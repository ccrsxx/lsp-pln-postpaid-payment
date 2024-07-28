'use client';

import { Prisma } from '@prisma/client';
import { useModal } from '@/lib/hooks/use-modal';
import { formatCurrency, formatDate } from '@/lib/format';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-header';
import { DataTableAction } from '@/components/ui/table/data-table-action';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { PaymentStatusChip } from '../payment-status-chip';
import { CreatePaymentDialog } from './create-payment-dialog';
import type { ColumnDef } from '@tanstack/react-table';

const billWithPayment = Prisma.validator<Prisma.BillDefaultArgs>()({
  include: {
    payment: true
  }
});

export type BillWithPayment = Prisma.BillGetPayload<typeof billWithPayment>;

export const columns: ColumnDef<BillWithPayment>[] = [
  {
    accessorKey: 'totalUsageKwh',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Usage' column={column} />;
    },
    cell: ({
      row: {
        original: { totalUsageKwh }
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
        original: { totalPrice }
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
        original: { payment }
      }
    }): JSX.Element => {
      const parsedStatus = payment?.[0]?.status;

      return <PaymentStatusChip status={parsedStatus} />;
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

      const canCreatePayment = [undefined, 'CANCELLED'].includes(
        row.original.payment?.[0]?.status
      );

      return (
        <>
          <CreatePaymentDialog
            open={open}
            bill={row.original}
            closeModal={closeModal}
          />
          <DataTableAction row={row} disableActions>
            <DropdownMenuItem onClick={openModal} disabled={!canCreatePayment}>
              Create payment
            </DropdownMenuItem>
          </DataTableAction>
        </>
      );
    }
  }
];
