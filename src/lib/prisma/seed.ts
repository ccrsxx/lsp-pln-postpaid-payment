import { faker } from '@faker-js/faker';
import { getAllRateVariants, getUniqueKwhNumber } from '@/app/actions/common';
import { prisma } from '../db.js';
import type { User, RateVariant } from '@prisma/client';

async function seedRateVariants(): Promise<void> {
  type RequiredRateVariant = Pick<RateVariant, 'feeRate'> & {
    name: string;
  };

  const rateVariants: RequiredRateVariant[] = [
    { name: '450 VA', feeRate: 100 },
    { name: '900 VA', feeRate: 200 },
    { name: '1300 VA', feeRate: 300 },
    { name: '2200 VA', feeRate: 400 }
  ];

  for (const { name, feeRate } of rateVariants) {
    await prisma.rateVariant.upsert({
      where: { name },
      update: {},
      create: {
        name,
        feeRate
      }
    });
  }
}

async function seedAdminUsers(): Promise<void> {
  type RequiredUser = Pick<User, 'name' | 'email' | 'image' | 'password'>;

  const users: RequiredUser[] = [
    {
      name: 'Risal Amin',
      email: 'aminrisal@gmail.com',
      image:
        'https://raw.githubusercontent.com/ccrsxx/portofolio/main/public/assets/emilia.png',
      password: '$2b$10$8XxvHtP2mJ0muJhjtvKuD.a4jp4a9RMpJevp5ORgOGZPM3732bvz6'
    }
  ];

  for (const { email, name, image, password } of users) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        image,
        password,
        role: 'ADMIN',
        kwhNumber: '177013813',
        rateVariant: {
          connect: {
            name: '2200 VA'
          }
        },
        usage: {
          create: {
            initialKwh: 69
          }
        }
      }
    });
  }
}

async function seedTestUsers(): Promise<void> {
  type RequiredUser = Pick<User, 'email' | 'name'>;

  const users: RequiredUser[] = Array.from({ length: 50 }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email()
  }));

  const rateVariants = await getAllRateVariants();

  for (const { email, name } of users) {
    const uniqueKwhNumber = await getUniqueKwhNumber();

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        role: 'USER',
        kwhNumber: uniqueKwhNumber,
        rateVariant: {
          connect: {
            name: faker.helpers.arrayElement(rateVariants)
          }
        },
        usage: {
          create: {
            initialKwh: 0
          }
        }
      }
    });
  }
}

async function main(): Promise<void> {
  try {
    await seedRateVariants();

    await seedAdminUsers();
    await seedTestUsers();

    await prisma.$disconnect();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void main();
