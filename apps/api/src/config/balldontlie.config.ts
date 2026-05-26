// ============================================================
// Na Quadra — Config: BallDontLie API
// ============================================================
import { registerAs } from '@nestjs/config';

export default registerAs('balldontlie', () => ({
  apiKey: process.env.BALLDONTLIE_API_KEY || '',
  baseUrl: process.env.BALLDONTLIE_BASE_URL || 'https://api.balldontlie.io/v1',
}));
