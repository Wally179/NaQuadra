// ============================================================
// Na Quadra — Config: ESPN API
// ============================================================
import { registerAs } from '@nestjs/config';

export default registerAs('espn', () => ({
  baseUrl: process.env.ESPN_BASE_URL || 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba',
  scoreboardIntervalSec: parseInt(process.env.ESPN_SCOREBOARD_INTERVAL_SEC || '30', 10),
}));
