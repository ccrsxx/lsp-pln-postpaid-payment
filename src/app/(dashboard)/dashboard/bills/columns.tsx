'use client';

import { Prisma, type PaymentStatus } from '@prisma/client';
import { useModal } from '@/lib/hooks/use-modal';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-header';
import { DataTableAction } from '@/components/ui/table/data-table-action';
import {
  DataTableCheckbox,
  DataTableCheckboxHeader
} from '@/components/ui/table/data-table-checkbox';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
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
    id: 'select',
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => <DataTableCheckbox row={row} />,
    header: ({ table }) => <DataTableCheckboxHeader table={table} />
  },
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
      const paymentStatus = (payment[0]?.status ?? 'UNPAID') as
        | PaymentStatus
        | 'UNPAID';

      return (
        <div
          className={cn('mr-auto w-fit rounded p-2', {
            'bg-accent': paymentStatus === 'UNPAID',
            'bg-blue-500': paymentStatus === 'PENDING',
            'bg-green-500': paymentStatus === 'COMPLETED',
            'bg-red-500': paymentStatus === 'CANCELLED'
          })}
        >
          {paymentStatus}
        </div>
      );
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
          <CreatePaymentDialog
            open={open}
            bill={row.original}
            closeModal={closeModal}
          />
          <DataTableAction
            row={row}
            slugLinkGenerator={(id: string) => `/dashboard/users/${id}/update`}
          >
            <DropdownMenuItem onClick={openModal}>
              Create payment
            </DropdownMenuItem>
          </DataTableAction>
        </>
      );
    }
  }
];
