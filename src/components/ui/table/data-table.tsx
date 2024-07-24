'use client';

import { useState, type ReactNode } from 'react';
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getFacetedUniqueValues,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState
} from '@tanstack/react-table';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader
} from '@/components/ui/table';
import { Input } from '../input';
import { DataTablePagination } from './data-table-pagination';
import { DataTableView } from './data-table-view';

type DataTableProps<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  children?: ReactNode;
};

export function DataTable<TData, TValue>({
  data,
  columns,
  children
}: DataTableProps<TData, TValue>): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility
  });

  const { getColumn, getRowModel, getRowCount, getHeaderGroups } = table;

  const rowCount = getRowCount();

  return (
    <div className='grid gap-4'>
      <div className='flex items-center gap-4'>
        <Input
          placeholder='Filter...'
          value={getColumn('email')?.getFilterValue() as string}
          onChange={(event) =>
            getColumn('email')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        {children}
        <DataTableView table={table} />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {getHeaderGroups().map(({ id, headers }) => (
              <TableRow key={id}>
                {headers.map(({ id, isPlaceholder, column, getContext }) => (
                  <TableHead key={id}>
                    {isPlaceholder
                      ? null
                      : flexRender(column.columnDef.header, getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rowCount ? (
              getRowModel().rows.map(
                ({ id, getIsSelected, getVisibleCells }) => (
                  <TableRow key={id} data-state={getIsSelected() && 'selected'}>
                    {getVisibleCells().map(({ id, column, getContext }) => (
                      <TableCell key={id}>
                        {flexRender(column.columnDef.cell, getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
