'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { RATE_VARIANT_NAMES, type RateVariantName } from '@/lib/types/enum';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from '@/components/ui/select';

export function RateVariantFilter(): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (term: string): void => {
    const params = new URLSearchParams(searchParams);

    if (term) params.set('query', term);
    else params.delete('query');

    if (term === 'All') params.delete('query');

    router.replace(`${pathname}?${params.toString()}`);
  };

  const currentRateVariant = searchParams.get('query') ?? '';

  const defaultRateVariant = RATE_VARIANT_NAMES.includes(
    currentRateVariant as RateVariantName
  )
    ? currentRateVariant
    : 'All';

  return (
    <Select onValueChange={handleSearch} defaultValue={defaultRateVariant}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='All Rate Variants' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='All'>All Rate Variants</SelectItem>
        {RATE_VARIANT_NAMES.map((name) => (
          <SelectItem value={name} key={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
