/**
 * Idempotent database seed for local and deployed environments.
 *
 * Local:  npm run seed
 * Server: docker compose -f docker-compose.prod.yml exec main-api node dist/database/seeds/seed.js
 *
 * Re-running is safe: it skips seeding when demo users already exist unless
 * invoked with `--force`, which wipes the demo data first.
 */
import { hash } from 'bcryptjs';
import { DataSource } from 'typeorm';

import AppDataSource from '../../config/typeorm.config';
import { Activity } from '../../modules/itineraries/entities/activity.entity';
import { Expense } from '../../modules/itineraries/entities/expense.entity';
import { Itinerary } from '../../modules/itineraries/entities/itinerary.entity';
import { ItineraryMember } from '../../modules/itineraries/entities/itinerary-member.entity';
import { EItineraryMemberRole } from '../../modules/itineraries/types/itineraries.types';
import { User } from '../../modules/users/entities/user.entity';
import { EAuthProvider, EUserRole } from '../../shared/types/auth.types';

const DEMO_PASSWORD = 'Password123!';
const DEMO_EMAILS = [
  'alice@example.com',
  'bob@example.com',
  'carol@example.com',
];

async function createUsers(dataSource: DataSource): Promise<User[]> {
  const hashedPassword = await hash(DEMO_PASSWORD, 10);
  const userRepository = dataSource.getRepository(User);

  const users = userRepository.create([
    {
      username: 'Alice Traveler',
      email: DEMO_EMAILS[0],
      password: hashedPassword,
      role: EUserRole.ADMIN,
      provider: EAuthProvider.DEFAULT,
    },
    {
      username: 'Bob Wanderer',
      email: DEMO_EMAILS[1],
      password: hashedPassword,
      role: EUserRole.USER,
      provider: EAuthProvider.DEFAULT,
    },
    {
      username: 'Carol Explorer',
      email: DEMO_EMAILS[2],
      password: hashedPassword,
      role: EUserRole.USER,
      provider: EAuthProvider.DEFAULT,
    },
  ]);

  return userRepository.save(users);
}

function buildJapanItinerary(owner: User, member: User): Itinerary {
  const itinerary = new Itinerary();
  itinerary.title = 'Japan Spring Trip';
  itinerary.description = 'Cherry blossoms across Tokyo and Kyoto.';
  itinerary.start_date = new Date('2026-04-01T00:00:00Z');
  itinerary.end_date = new Date('2026-04-10T00:00:00Z');
  itinerary.destinations = ['Tokyo', 'Kyoto', 'Osaka'];
  itinerary.members = [
    buildMember(owner, EItineraryMemberRole.OWNER),
    buildMember(member, EItineraryMemberRole.MEMBER),
  ];
  itinerary.activites = [
    buildActivity(
      'Senso-ji Temple visit',
      'Morning walk through Asakusa.',
      new Date('2026-04-02T09:00:00Z'),
      'Tokyo',
    ),
    buildActivity(
      'Fushimi Inari hike',
      'Thousands of torii gates.',
      new Date('2026-04-05T08:00:00Z'),
      'Kyoto',
    ),
  ];
  itinerary.expenses = [
    buildExpense('Shinkansen tickets', 280, 'USD', 'Tokyo to Kyoto'),
    buildExpense('Ryokan stay', 450, 'USD', '2 nights, traditional inn'),
  ];
  return itinerary;
}

function buildItalyItinerary(owner: User): Itinerary {
  const itinerary = new Itinerary();
  itinerary.title = 'Italy Food Tour';
  itinerary.description = 'Pasta, pizza and gelato weekend.';
  itinerary.start_date = new Date('2026-09-12T00:00:00Z');
  itinerary.end_date = new Date('2026-09-16T00:00:00Z');
  itinerary.destinations = ['Rome', 'Florence'];
  itinerary.members = [buildMember(owner, EItineraryMemberRole.OWNER)];
  itinerary.activites = [
    buildActivity(
      'Colosseum tour',
      'Guided afternoon tour.',
      new Date('2026-09-13T14:00:00Z'),
      'Rome',
    ),
  ];
  itinerary.expenses = [
    buildExpense('Cooking class', 120, 'EUR', 'Handmade pasta workshop'),
  ];
  return itinerary;
}

function buildMember(user: User, role: EItineraryMemberRole): ItineraryMember {
  const member = new ItineraryMember();
  member.user_id = user.id;
  member.role = role;
  return member;
}

function buildActivity(
  title: string,
  description: string,
  date: Date,
  location: string,
): Activity {
  const activity = new Activity();
  activity.title = title;
  activity.description = description;
  activity.date = date;
  activity.location = location;
  return activity;
}

function buildExpense(
  title: string,
  amount: number,
  currency: string,
  notes: string,
): Expense {
  const expense = new Expense();
  expense.title = title;
  expense.amount = amount;
  expense.currency = currency;
  expense.notes = notes;
  return expense;
}

async function createFavorite(
  dataSource: DataSource,
  user: User,
  itinerary: Itinerary,
): Promise<void> {
  // favorite_itineraries uses a composite (user_id, itinerary_id) primary key
  // whose columns double as relations, which trips up repository.create().
  // Insert by id directly, exactly as FavoritesService does.
  await dataSource.query(
    `INSERT INTO favorite_itineraries (user_id, itinerary_id) VALUES ($1, $2)`,
    [user.id, itinerary.id],
  );
}

async function clearDemoData(dataSource: DataSource): Promise<void> {
  // Cascades remove members, activities, expenses and favorites.
  await dataSource.getRepository(Itinerary).delete({});
  await dataSource
    .getRepository(User)
    .createQueryBuilder()
    .delete()
    .where('email IN (:...emails)', { emails: DEMO_EMAILS })
    .execute();
}

async function demoDataExists(dataSource: DataSource): Promise<boolean> {
  const count = await dataSource
    .getRepository(User)
    .createQueryBuilder('user')
    .where('user.email IN (:...emails)', { emails: DEMO_EMAILS })
    .getCount();
  return count > 0;
}

async function seed(): Promise<void> {
  const force = process.argv.includes('--force');
  const dataSource = await AppDataSource.initialize();

  try {
    if (await demoDataExists(dataSource)) {
      if (!force) {
        console.log(
          'Demo data already present — skipping. Use --force to reseed.',
        );
        return;
      }
      console.log('--force passed: clearing existing demo data...');
      await clearDemoData(dataSource);
    }

    const [alice, bob, carol] = await createUsers(dataSource);

    const itineraryRepository = dataSource.getRepository(Itinerary);
    const japan = await itineraryRepository.save(
      buildJapanItinerary(alice, bob),
    );
    const italy = await itineraryRepository.save(buildItalyItinerary(carol));

    await createFavorite(dataSource, bob, japan);
    await createFavorite(dataSource, alice, italy);

    console.log('Seed complete:');
    console.log(`  Users:       ${alice.email}, ${bob.email}, ${carol.email}`);
    console.log(`  Password:    ${DEMO_PASSWORD} (all users)`);
    console.log(`  Itineraries: "${japan.title}", "${italy.title}"`);
  } finally {
    await dataSource.destroy();
  }
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
