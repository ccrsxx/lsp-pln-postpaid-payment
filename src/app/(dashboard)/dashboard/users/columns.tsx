'use client';

import { Prisma } from '@prisma/client';
import { useModal } from '@/lib/hooks/use-modal';
import { formatDate } from '@/lib/format';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-header';
import { DataTableAction } from '@/components/ui/table/data-table-action';
import {
  DataTableCheckbox,
  DataTableCheckboxHeader
} from '@/components/ui/table/data-table-checkbox';
import { CreateBillDialog } from './bills/create-bill-dialog';
import type { ColumnDef } from '@tanstack/react-table';

const userWithRateVariant = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    rateVariant: true,
    usage: {
      where: {
        active: true
      }
    }
  }
});

export type UserWithRateVariantAndUsage = Prisma.UserGetPayload<
  typeof userWithRateVariant
>;

export const columns: ColumnDef<UserWithRateVariantAndUsage>[] = [
  {
    id: 'select',
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => <DataTableCheckbox row={row} />,
    header: ({ table }) => <DataTableCheckboxHeader table={table} />
  },
  {
    accessorKey: 'kwhNumber',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Kwh Number' column={column} />;
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Name' column={column} />;
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Email' column={column} />;
    }
  },
  {
    accessorKey: 'rateVariant',
    accessorFn: ({ rateVariant: { name } }) => name,
    header: ({ column }): JSX.Element => {
      return <DataTableColumnHeader title='Rate Variant' column={column} />;
    },
    filterFn: (row, id, value: string[]): boolean => {
      return value.includes(row.getValue(id));
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
          <CreateBillDialog
            user={row.original}
            open={open}
            closeModal={closeModal}
          />
          <DataTableAction
            row={row}
            slugLinkGenerator={(id: string) => `/dashboard/users/${id}/update`}
          >
            <DropdownMenuItem
              onClick={openModal}
              disabled={!row.original.usage.length}
            >
              Create Bill
            </DropdownMenuItem>
          </DataTableAction>
        </>
      );
    }
  }
];
