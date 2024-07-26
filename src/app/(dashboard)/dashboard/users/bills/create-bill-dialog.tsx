import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  createBillActionsSchema,
  createBillSchema,
  type CreateBillSchema
} from './schema';
import { createBill } from './actions';
import type { UserWithRateVariantAndUsage } from '../columns';

type CreateBillDialogProps = {
  open: boolean;
  user: UserWithRateVariantAndUsage;
  closeModal: () => void;
};

export function CreateBillDialog({
  open,
  user,
  closeModal
}: CreateBillDialogProps): JSX.Element {
  const {
    id,
    name,
    usage: [{ createdAt, initialKwh }]
  } = user;

  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateBillSchema>({
    resolver: zodResolver(createBillSchema)
  });

  const onSubmit = ({ finalKwh }: CreateBillSchema): void => {
    if (finalKwh < initialKwh) {
      form.setError('finalKwh', {
        type: 'manual',
        message: 'Final kWh must be greater than initial kWh'
      });

      return;
    }

    const { data, success } = createBillActionsSchema.safeParse({
      userId: id,
      finalKwh
    });

    if (!success) {
      toast.error('Invalid form data');

      return;
    }

    startTransition(() => {
      toast.promise(createBill(data), {
        loading: 'Creating...',
        success: (res) => {
          if ('error' in res) throw new Error(res.error);

          closeModal();

          return res.success;
        },
        error: (err) => {
          if (err instanceof Error) return err.message;

          return 'An error occurred';
        }
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create bill</DialogTitle>
          <DialogDescription>Create bill form {name}</DialogDescription>
        </DialogHeader>
        <Alert className='mt-1'>
          <AlertTitle>Details</AlertTitle>
          <AlertDescription>Date: {formatDate(createdAt)}</AlertDescription>
          <AlertDescription>Initial kWh: {initialKwh}</AlertDescription>
        </Alert>
        <Form {...form}>
          <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='finalKwh'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Final kWh</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Final'
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button className='ml-auto' type='submit' disabled={isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
