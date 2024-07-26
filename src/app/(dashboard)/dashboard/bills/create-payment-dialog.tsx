import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatCurrency } from '@/lib/format';
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
import { createPayment } from './actions';
import { createPaymentSchema, type CreatePaymentSchema } from './schema';
import type { BillWithPayment } from './columns';

type CreateBillDialogProps = {
  open: boolean;
  bill: BillWithPayment;
  closeModal: () => void;
};

export function CreatePaymentDialog({
  open,
  bill,
  closeModal
}: CreateBillDialogProps): JSX.Element {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreatePaymentSchema>({
    resolver: zodResolver(createPaymentSchema)
  });

  const onSubmit = (data: CreatePaymentSchema): void => {
    startTransition(() => {
      toast.promise(createPayment(data), {
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
          <DialogTitle>Create payment</DialogTitle>
          <DialogDescription>Create payment form</DialogDescription>
        </DialogHeader>
        <Alert className='mt-1'>
          <AlertTitle>Details</AlertTitle>
          <AlertDescription>
            Total Usage {bill.totalUsageKwh} kWh with price of{' '}
            {formatCurrency(bill.totalPrice)}
          </AlertDescription>
        </Alert>
        <Form {...form}>
          <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name='accountName'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account name</FormLabel>
                  <FormControl>
                    <Input placeholder='Ami' disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='accountNumber'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='177013'
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
