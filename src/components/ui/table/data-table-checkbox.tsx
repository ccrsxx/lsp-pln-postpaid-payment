import { Checkbox } from '@/components/ui/checkbox';
import type { Row, Table } from '@tanstack/react-table';

type DataTableCheckboxHeaderProps<TData> = {
  table: Table<TData>;
};

export function DataTableCheckboxHeader<TData>({
  table
}: DataTableCheckboxHeaderProps<TData>): JSX.Element {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label='Select all'
    />
  );
}

type DataTableCheckboxProps<TData> = {
  row: Row<TData>;
};

export function DataTableCheckbox<TData>({
  row
}: DataTableCheckboxProps<TData>): JSX.Element {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label='Select row'
    />
  );
}
