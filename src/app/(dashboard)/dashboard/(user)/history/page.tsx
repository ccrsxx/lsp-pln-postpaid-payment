import { auth } from '@/auth';
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
  const session = await auth();

  const bills = await prisma.payment.findMany({
    where: {
      userId: session?.user.id
    },
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
          root={{ name: 'History', href: '/dashboard/history' }}
          current='All Payments History'
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payments history</CardTitle>
          <CardDescription>A list of all payments history.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={bills} columns={columns} />
        </CardContent>
      </Card>
    </main>
  );
}
