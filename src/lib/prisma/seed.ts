import { faker } from '@faker-js/faker';
import {
  getAllRateVariants,
  getUniqueKwhNumber
} from '@/lib/actions/common.js';
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
  type RequiredUser = Pick<
    User,
    'name' | 'role' | 'email' | 'image' | 'password' | 'kwhNumber'
  >;

  const users: RequiredUser[] = [
    {
      name: 'Risal Amin',
      email: 'aminrisal@gmail.com',
      role: 'ADMIN',
      image:
        'https://raw.githubusercontent.com/ccrsxx/portofolio/main/public/assets/emilia.png',
      password: '$2b$10$8XxvHtP2mJ0muJhjtvKuD.a4jp4a9RMpJevp5ORgOGZPM3732bvz6',
      kwhNumber: '177013813'
    },
    {
      name: 'Test',
      email: 'test@gmail.com',
      role: 'USER',
      image: null,
      password: '$2b$10$8Fn.kZ1bZ6GHEoOuM9bGoeIJBdPh9wbl2CEQp.sMsQTgNESRotdta',
      kwhNumber: '177013814'
    }
  ];

  for (const { email, name, kwhNumber, role, image, password } of users) {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        role,
        name,
        email,
        image,
        password,
        kwhNumber,
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
