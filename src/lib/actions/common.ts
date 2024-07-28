import { randomInt } from 'crypto';

export async function getAllRateVariants(): Promise<string[]> {
  const rateVariants = await prisma.rateVariant.findMany({
    select: {
      name: true
    }
  });

  const rateVariantNames = rateVariants.map(({ name }) => name);

  return rateVariantNames;
}

export async function getUniqueKwhNumber(): Promise<string> {
  const generateRandomKwhNumber = (): string =>
    randomInt(1, 999_999_999).toString().padStart(9, '0');

  const checkUniqueKwhNumber = async (kwhNumber: string): Promise<boolean> =>
    !!(await prisma.user.findUnique({ where: { kwhNumber } }));

  let uniqueRandomNumber = generateRandomKwhNumber();

  while (await checkUniqueKwhNumber(uniqueRandomNumber)) {
    uniqueRandomNumber = generateRandomKwhNumber();
  }

  return uniqueRandomNumber;
}
