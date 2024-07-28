import { toast } from 'sonner';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '../button';
import type { ReactNode } from 'react';
import type { Row } from '@tanstack/react-table';

type DataTableActionProps<TData> = {
  row: Row<TData & { id: string }>;
  children?: ReactNode;
  disableActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function DataTableAction<TData>({
  row,
  children,
  disableActions,
  onEdit,
  onDelete
}: DataTableActionProps<TData>): JSX.Element {
  const recordId = row.original.id;

  const handleRecordCopyId = (): void => {
    toast.success('ID copied to clipboard');
    void navigator.clipboard.writeText(recordId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleRecordCopyId}>
          Copy ID
        </DropdownMenuItem>
        {!disableActions && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
          </>
        )}
        {children && (
          <>
            <DropdownMenuSeparator />
            {children}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
