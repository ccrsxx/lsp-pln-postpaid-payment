import { DashboardBreadcrumb } from '@/app/(dashboard)/dashboard/dashboard-breadcrumb';
import { getAllRateVariants } from '@/app/actions/common';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { CreateUserForm } from './create-user-form';

export default async function CreateUser(): Promise<JSX.Element> {
  const rateVariants = await getAllRateVariants();

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='flex items-center gap-4'>
        <DashboardBreadcrumb
          root={{ name: 'Users', href: '/dashboard/users' }}
          current='Create User'
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create User</CardTitle>
          <CardDescription>
            Fill out the form below to create a new user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserForm rateVariants={rateVariants} />
        </CardContent>
      </Card>
    </main>
  );
}
