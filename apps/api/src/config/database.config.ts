// ============================================================
// Na Quadra — Config: Database
// ============================================================
import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  postgres: {
    // Neon PostgreSQL url, e.g., postgresql://user:pass@ep-host.region.aws.neon.tech/dbname?sslmode=require
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/naquadra',
  },
  mongodb: {
    // MongoDB Atlas uri
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/naquadra',
  },
}));
