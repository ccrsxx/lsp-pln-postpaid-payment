'use client';

import { DataTableColumnHeader } from '@/components/ui/table/data-table-header';
import { DataTableAction } from '@/components/ui/table/data-table-action';
import {
  DataTableCheckbox,
  DataTableCheckboxHeader
} from '@/components/ui/table/data-table-checkbox';
import type { User } from '@prisma/client';
import type { ColumnDef } from '@tanstack/react-table';

export type Customer = Pick<
  User,
  'id' | 'name' | 'email' | 'createdAt' | 'kwhNumber'
> & {
  RateVariant: { name: string };
};

export const columns: ColumnDef<Customer>[] = [
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
    accessorFn: ({ RateVariant: { name } }) => name,
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
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString()
  },
  {
    id: 'actions',
    cell: ({ row }): JSX.Element => {
      return <DataTableAction row={row} />;
    }
  }
];
