// ============================================================
// Na Quadra — Database Seed Runner
// Seeds MySQL (teams) + MongoDB (glossary, articles)
// Usage: npx ts-node src/database/seeds/run-seed.ts
// ============================================================
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import mongoose from 'mongoose';
import { TEAMS_SEED } from './teams.seed';
import { GLOSSARY_SEED } from './glossary.seed';
import { ARTICLES_SEED } from './articles.seed';

// ── Config (reads from .env or uses defaults) ──
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = parseInt(process.env.MYSQL_PORT || '3306', 10);
const MYSQL_USER = process.env.MYSQL_USERNAME || 'naquadra';
const MYSQL_PASS = process.env.MYSQL_PASSWORD || 'naquadra_dev_2026';
const MYSQL_DB = process.env.MYSQL_DATABASE || 'naquadra';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/naquadra';

async function seed() {
  console.log('🏀 Na Quadra — Database Seed');
  console.log('═══════════════════════════════\n');

  // ── MySQL: Teams ──
  console.log('📦 Connecting to MySQL...');
  const mysql = new DataSource({
    type: 'mysql',
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    username: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DB,
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'],
  });

  try {
    await mysql.initialize();
    console.log('✅ MySQL connected\n');

    // Seed teams
    console.log('🏀 Seeding teams...');
    const teamRepo = mysql.getRepository('TeamEntity');

    for (const team of TEAMS_SEED) {
      await teamRepo.save(teamRepo.create(team));
    }
    console.log(`   ✅ ${TEAMS_SEED.length} teams seeded\n`);

    await mysql.destroy();
  } catch (err) {
    console.error('❌ MySQL seed failed:', (err as Error).message);
    console.log('   ⚠️  Make sure MySQL is running: docker compose up -d mysql\n');
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
