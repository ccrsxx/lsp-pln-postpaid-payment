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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl
} from '@/components/ui/form';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from '@/components/ui/select';
import { validatePayment } from './actions';
import {
  validatePaymentSchema,
  VALID_PAYMENT_STATUSES,
  validatePaymentActionsSchema,
  type ValidPaymentStatus,
  type ValidatePaymentSchema
} from './schema';
import type { PaymentWithUserAndBill } from './columns';

type ValidatePaymentDialogProps = {
  open: boolean;
  payment: PaymentWithUserAndBill;
  closeModal: () => void;
};

export function ValidatePaymentDialog({
  open,
  payment,
  closeModal
}: ValidatePaymentDialogProps): JSX.Element {
  const {
    id: paymentId,
    bill: { totalPrice },
    status,
    accountName,
    accountNumber
  } = payment;

  const parsedDefaultStatus = VALID_PAYMENT_STATUSES.includes(
    status as ValidPaymentStatus
  )
    ? (status as ValidPaymentStatus)
    : undefined;

  const [isPending, startTransition] = useTransition();

  const form = useForm<ValidatePaymentSchema>({
    resolver: zodResolver(validatePaymentSchema),
    defaultValues: {
      status: parsedDefaultStatus
    }
  });

  const onSubmit = ({ status }: ValidatePaymentSchema): void => {
    const { data, success } = validatePaymentActionsSchema.safeParse({
      status,
      paymentId
    });

    if (!success) {
      toast.error('Invalid form data');
      return;
    }

    startTransition(() => {
      toast.promise(validatePayment(data), {
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
          <DialogTitle>Validate payment</DialogTitle>
          <DialogDescription>Validate payment form</DialogDescription>
        </DialogHeader>
        <Alert className='mt-1'>
          <AlertTitle>Details</AlertTitle>
          <AlertDescription>
            Amount: {formatCurrency(totalPrice)}
          </AlertDescription>
          <AlertDescription>Account Name: {accountName}</AlertDescription>
          <AlertDescription>Account Number: {accountNumber}</AlertDescription>
        </Alert>
        <Form {...form}>
          <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a payment status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {VALID_PAYMENT_STATUSES.map((name) => (
                        <SelectItem value={name} key={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
