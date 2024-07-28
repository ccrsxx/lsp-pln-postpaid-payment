/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { toast } from 'sonner';
import { Prisma } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useModal } from '@/lib/hooks/use-modal';
import { formatDate } from '@/lib/format';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-header';
import { DataTableAction } from '@/components/ui/table/data-table-action';
import { ActionDialog } from '@/components/dialog/action-dialog';
import { deleteUser } from './actions';
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
      const router = useRouter();

      const {
        open: createUserDialogOpen,
        openModal: openCreateUserDialog,
        closeModal: closeCreateUserDialog
      } = useModal();

      const {
        open: actionDialogOpen,
        openModal: openActionDialog,
        closeModal: closeActionDialog
      } = useModal();

      const handleDelete = (): void => {
        toast.promise(deleteUser(row.original.id), {
          loading: 'Deleting...',
          success: (res) => {
            closeActionDialog();

            if ('error' in res) throw new Error(res.error);

            return res.success;
          },
          error: (err) => {
            if (err instanceof Error) return err.message;

            return 'An error occurred';
          }
        });
      };

      const handleEdit = (): void => {
        router.push(`/dashboard/users/${row.original.id}/update`);
      };

      return (
        <>
          <CreateBillDialog
            user={row.original}
            open={createUserDialogOpen}
            closeModal={closeCreateUserDialog}
          />
          <ActionDialog
            open={actionDialogOpen}
            action={handleDelete}
            closeModal={closeActionDialog}
          />
          <DataTableAction
            row={row}
            onEdit={handleEdit}
            onDelete={openActionDialog}
          >
            <DropdownMenuItem
              onClick={openCreateUserDialog}
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
