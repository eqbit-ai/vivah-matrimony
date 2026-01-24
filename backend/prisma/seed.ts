import { PrismaClient, Gender, Religion, Role, MaritalStatus, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const adminPasswordHash = await bcrypt.hash('Admin@123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vivahmatrimony.com' },
    update: {},
    create: {
      email: 'admin@vivahmatrimony.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      isEmailVerified: true,
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample male user
  const malePasswordHash = await bcrypt.hash('User@123', 12);
  
  const maleUser = await prisma.user.upsert({
    where: { email: 'rahul@example.com' },
    update: {},
    create: {
      email: 'rahul@example.com',
      passwordHash: malePasswordHash,
      role: Role.USER,
      isEmailVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Rahul',
          lastName: 'Sharma',
          gender: Gender.MALE,
          dateOfBirth: new Date('1995-06-15'),
          religion: Religion.HINDU,
          caste: 'Brahmin',
          motherTongue: 'Hindi',
          state: 'Maharashtra',
          city: 'Mumbai',
          education: 'B.Tech Computer Science',
          profession: 'Software Engineer',
          annualIncome: '25-35 LPA',
          height: 175,
          maritalStatus: MaritalStatus.NEVER_MARRIED,
          diet: 'Vegetarian',
          bio: 'A passionate software engineer who loves traveling and reading.',
          hobbies: ['Reading', 'Traveling', 'Photography'],
          phone: '9876543210',
          isComplete: true,
        },
      },
      subscription: {
        create: {
          status: SubscriptionStatus.PAID,
          planName: 'Basic Plan',
          amount: 149900,
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  console.log('✅ Male user created:', maleUser.email);

  // Create sample female user  
  const femaleUser = await prisma.user.upsert({
    where: { email: 'priya@example.com' },
    update: {},
    create: {
      email: 'priya@example.com',
      passwordHash: malePasswordHash,
      role: Role.USER,
      isEmailVerified: true,
      isActive: true,
      profile: {
        create: {
          firstName: 'Priya',
          lastName: 'Patel',
          gender: Gender.FEMALE,
          dateOfBirth: new Date('1997-03-20'),
          religion: Religion.HINDU,
          caste: 'Patel',
          motherTongue: 'Gujarati',
          state: 'Gujarat',
          city: 'Ahmedabad',
          education: 'MBA',
          profession: 'Product Manager',
          annualIncome: '20-30 LPA',
          height: 162,
          maritalStatus: MaritalStatus.NEVER_MARRIED,
          diet: 'Vegetarian',
          bio: 'An ambitious product manager who believes in work-life balance.',
          hobbies: ['Cooking', 'Dancing', 'Yoga'],
          phone: '9876543211',
          isComplete: true,
        },
      },
      subscription: {
        create: {
          status: SubscriptionStatus.FREE,
          planName: 'Free',
        },
      },
    },
  });

  console.log('✅ Female user created:', femaleUser.email);
  console.log('🎉 Seeding completed!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@vivahmatrimony.com / Admin@123');
  console.log('Male User: rahul@example.com / User@123');
  console.log('Female User: priya@example.com / User@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
