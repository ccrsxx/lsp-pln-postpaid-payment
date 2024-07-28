import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAllRateVariants } from '@/lib/actions/common';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/table/data-table';
import { DashboardBreadcrumb } from '../../../../components/dashboard/dashboard-breadcrumb';
import { RateVariantFilter } from './rate-variant-filter';
import { columns } from './columns';

export default async function Users({
  searchParams
}: {
  searchParams?: { query?: string };
}): Promise<JSX.Element> {
  const parsedQuery = searchParams?.query?.trim() ?? '';

  const users = await prisma.user.findMany({
    include: {
      rateVariant: true,
      usage: {
        where: {
          active: true
        }
      }
    },
    where: {
      ...(parsedQuery && {
        rateVariant: {
          name: {
            equals: parsedQuery
          }
        }
      })
    }
  });

  const rateVariants = await getAllRateVariants();

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='flex items-center gap-4'>
        <DashboardBreadcrumb
          root={{ name: 'Users', href: '/dashboard/users' }}
          current='All Users'
        />
        <Button size='sm' className='ml-auto h-8 gap-1' asChild>
          <Link href='/dashboard/users/create'>
            <PlusCircle className='h-3.5 w-3.5' />
            <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
              Add User
            </span>
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all users.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={users} columns={columns}>
            <RateVariantFilter rateVariants={rateVariants} />
          </DataTable>
        </CardContent>
      </Card>
    </main>
  );
}
