import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Delete existing users to avoid conflicts
  await prisma.user.deleteMany();

  // Insert sample users (converted from existing seed.sql)
  const users = await prisma.user.createMany({
    data: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'john@example.com',
        name: 'John Doe',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'jane@example.com',
        name: 'Jane Smith',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        createdAt: new Date('2024-01-02T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'bob@example.com',
        name: 'Bob Johnson',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        createdAt: new Date('2024-01-03T00:00:00.000Z'),
        updatedAt: new Date('2024-01-03T00:00:00.000Z'),
      },
      {
        id: '44444444-4444-4444-4444-444444444444',
        email: 'alice@example.com',
        name: 'Alice Brown',
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        createdAt: new Date('2024-01-04T00:00:00.000Z'),
        updatedAt: new Date('2024-01-04T00:00:00.000Z'),
      },
      {
        id: '55555555-5555-5555-5555-555555555555',
        email: 'charlie@example.com',
        name: 'Charlie Wilson',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        createdAt: new Date('2024-01-05T00:00:00.000Z'),
        updatedAt: new Date('2024-01-05T00:00:00.000Z'),
      },
    ],
  });

  console.log(`Created ${users.count} users`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
