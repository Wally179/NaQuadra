// ============================================================
// Na Quadra — Config: Auth (JWT)
// ============================================================
import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET || 'nq-dev-jwt-secret-change-in-production',
  jwtExpiration: process.env.JWT_EXPIRATION || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'nq-dev-refresh-secret-change-in-production',
  refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
