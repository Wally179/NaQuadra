// ============================================================
// Na Quadra — Database Seed Runner
// Seeds PostgreSQL (teams) + MongoDB (glossary, articles)
// Usage: npx ts-node src/database/seeds/run-seed.ts
// ============================================================
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import mongoose from 'mongoose';
import { TeamEntity } from '../../modules/teams/entities/team.entity';
import { TEAMS_SEED } from './teams.seed';
import { GLOSSARY_SEED } from './glossary.seed';
import { ARTICLES_SEED } from './articles.seed';

// ── Config (reads from .env or uses defaults) ──
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/naquadra';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/naquadra';

async function seed() {
  console.log('🏀 Na Quadra — Database Seed');
  console.log('═══════════════════════════════\n');

  // ── PostgreSQL: Teams ──
  console.log('📦 Connecting to PostgreSQL...');
  const postgres = new DataSource({
    type: 'postgres',
    url: DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'],
  });

  try {
    await postgres.initialize();
    console.log('✅ PostgreSQL connected\n');

    // Seed teams
    console.log('🏀 Seeding teams...');
    const teamRepo = postgres.getRepository(TeamEntity);

    for (const team of TEAMS_SEED) {
      await teamRepo.save(teamRepo.create(team));
    }
    console.log(`   ✅ ${TEAMS_SEED.length} teams seeded\n`);

    await postgres.destroy();
  } catch (err) {
    console.error('❌ PostgreSQL seed failed:', (err as Error).message);
    console.log('   ⚠️  Make sure PostgreSQL is running: docker compose up -d postgres\n');
  }

  // ── MongoDB: Glossary + Articles ──
  console.log('📦 Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected\n');

    // Seed glossary
    console.log('📚 Seeding glossary...');
    const glossaryCol = mongoose.connection.collection('glossary');
    for (const entry of GLOSSARY_SEED) {
      await glossaryCol.updateOne(
        { slug: entry.slug },
        { $set: { ...entry, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        { upsert: true },
      );
    }
    console.log(`   ✅ ${GLOSSARY_SEED.length} glossary terms seeded\n`);

    // Seed articles
    console.log('📰 Seeding articles...');
    const articlesCol = mongoose.connection.collection('articles');
    for (const article of ARTICLES_SEED) {
      const searchText = [article.title, article.subtitle, article.tags.join(' ')].filter(Boolean).join(' ');
      await articlesCol.updateOne(
        { slug: article.slug },
        {
          $set: { ...article, searchText, updatedAt: new Date() },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true },
      );
    }
    console.log(`   ✅ ${ARTICLES_SEED.length} articles seeded\n`);

    // Create text indexes
    console.log('🔍 Creating indexes...');
    try {
      await glossaryCol.createIndex({ term: 'text', shortDefinition: 'text' });
      await glossaryCol.createIndex({ category: 1 });
      await articlesCol.createIndex({ slug: 1 }, { unique: true });
      await articlesCol.createIndex({ publishedAt: -1 });
      await articlesCol.createIndex({ category: 1, publishedAt: -1 });
      await articlesCol.createIndex({ searchText: 'text' });
      console.log('   ✅ Indexes created\n');
    } catch {
      console.log('   ⚠️  Some indexes already exist (ok)\n');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ MongoDB seed failed:', (err as Error).message);
    console.log('   ⚠️  Make sure MongoDB is running: docker compose up -d mongodb\n');
  }

  console.log('═══════════════════════════════');
  console.log('🎉 Seed complete!');
  console.log('   API should now have real data.');
  console.log('   Start with: pnpm --filter @naquadra/api dev');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
