import { redirect } from 'next/navigation';
import { DashboardBreadcrumb } from '@/app/(dashboard)/dashboard/dashboard-breadcrumb';
import { getAllRateVariants } from '@/app/actions/common';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { UpdateUserForm } from './update-user-form';

export default async function UpdateUser({
  params
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const id = params.id;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      kwhNumber: true,
      rateVariant: {
        select: { name: true }
      }
    }
  });

  if (!user) redirect('/dashboard/users');

  const rateVariants = await getAllRateVariants();

  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='flex items-center gap-4'>
        <DashboardBreadcrumb
          root={{ name: 'Users', href: '/dashboard/users' }}
          current='Update User'
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Update User</CardTitle>
          <CardDescription>
            Fill out the form below to update a user
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateUserForm user={user} rateVariants={rateVariants} />
        </CardContent>
      </Card>
    </main>
  );
}
