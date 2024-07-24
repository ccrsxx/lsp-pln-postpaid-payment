export const RATE_VARIANT_NAMES = [
  '450 VA',
  '900 VA',
  '1300 VA',
  '2200 VA'
] as const;

export type RateVariantName = (typeof RATE_VARIANT_NAMES)[number];
