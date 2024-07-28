import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/table/data-table';
import { DashboardBreadcrumb } from '@/components/dashboard/dashboard-breadcrumb';
import { columns } from './columns';

export default async function Bills(): Promise<JSX.Element> {
  const bills = await prisma.payment.findMany({
    include: {
      user: true,
      bill: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='flex h-8 items-center gap-4'>
        <DashboardBreadcrumb
          root={{ name: 'Payments', href: '/dashboard/payments' }}
          current='All Payments'
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>A list of all payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={bills} columns={columns} />
        </CardContent>
      </Card>
    </main>
  );
}
