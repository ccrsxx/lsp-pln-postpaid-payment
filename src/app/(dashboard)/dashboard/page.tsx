import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { DashboardBreadcrumb } from './dashboard-breadcrumb';

export default function Users(): JSX.Element {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='flex items-center gap-4'>
        <DashboardBreadcrumb
          root={{ name: 'Users', href: '/dashboard/users' }}
          current='All Users'
        />
        <Button size='sm' className='ml-auto h-8 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
            Add Product
          </span>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            A list of all customers that have made a purchase.
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </main>
  );
}
