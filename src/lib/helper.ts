import { randomInt } from 'crypto';
import type { SyntheticEvent } from 'react';

type PreventBubblingProps = {
  preventDefault?: boolean;
  callback?: (...args: never[]) => unknown;
};

/**
 * Prevents the event from bubbling up the DOM tree.
 */
export function preventBubbling({
  preventDefault,
  callback
}: PreventBubblingProps = {}) {
  return (e: SyntheticEvent): void => {
    e.stopPropagation();

    if (preventDefault) e.preventDefault();
    if (callback) callback();
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getUniqueKwhNumber(): Promise<string> {
  const generateRandomKwhNumber = (): string =>
    randomInt(1, 999_999_999).toString().padStart(9, '12');

  const checkUniqueKwhNumber = async (kwhNumber: string): Promise<boolean> =>
    !!(await prisma.user.findUnique({ where: { kwhNumber } }));

  let uniqueRandomNumber = generateRandomKwhNumber();

  while (await checkUniqueKwhNumber(uniqueRandomNumber)) {
    uniqueRandomNumber = generateRandomKwhNumber();
  }

  return uniqueRandomNumber;
}
