import { auth } from '@/auth';
import { getAllRateVariants } from '@/app/actions/common';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/table/data-table';
import { DashboardBreadcrumb } from '../dashboard-breadcrumb';
import { RateVariantFilter } from '../users/rate-variant-filter';
import { columns } from './columns';

export default async function Bills(): Promise<JSX.Element> {
  const session = await auth();

  const bills = await prisma.bill.findMany({
    where: {
      userId: session?.user.id
    },
    include: {
      payment: true
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
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bills</CardTitle>
          <CardDescription>A list of all bills.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={bills} columns={columns}>
            <RateVariantFilter rateVariants={rateVariants} />
          </DataTable>
        </CardContent>
      </Card>
    </main>
  );
}
