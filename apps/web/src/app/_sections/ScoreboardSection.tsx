// ============================================================
// Na Quadra — Scoreboard Section (Async Server Component)
// Fetches scoreboard data independently and streams via Suspense.
// ============================================================

import { ScoreboardBar } from '@/components/features/scoreboard/ScoreboardBar/ScoreboardBar';
import { fetchScoreboard, type ScoreboardGame } from '@/lib/api';
import { addDays, format } from 'date-fns';
import type { NormalizedGame } from '@naquadra/types';

/** Map API scoreboard data to the NormalizedGame format */
function mapToNormalizedGame(game: ScoreboardGame): NormalizedGame {
  return {
    externalId: game.externalId,
    date: game.date,
    startTime: game.startTime,
    status: game.status as NormalizedGame['status'],
    homeTeamId: game.homeTeamId,
    awayTeamId: game.awayTeamId,
    homeScore: game.homeScore,
    awayScore: game.awayScore,
    homeRecord: game.homeRecord,
    awayRecord: game.awayRecord,
    quarter: game.quarter,
    clock: game.clock,
    conference: '',
    phase: game.seriesInfo ? 'playoffs' : 'regular',
    seriesInfo: game.seriesInfo,
    venue: game.venue,
    broadcast: game.broadcast,
    lastUpdated: new Date().toISOString(),
  };
}

export async function ScoreboardSection() {
  let games: NormalizedGame[] = [];

  try {
    const today = new Date();

    // OPTIMIZATION: Fetch multiple days in parallel (batches of 5) instead of sequentially.
    // This is the #1 performance fix — was previously a sequential while-loop.
    const daysToFetch = Array.from({ length: 15 }, (_, i) => i);
    const batchSize = 5;

    for (let batchStart = 0; batchStart < daysToFetch.length && games.length < 6; batchStart += batchSize) {
      const batch = daysToFetch.slice(batchStart, batchStart + batchSize);
      const batchResults = await Promise.all(
        batch.map((dayOffset) => {
          const targetDate = addDays(today, dayOffset);
          const dateStr = format(targetDate, 'yyyyMMdd');
          return fetchScoreboard(dateStr).catch(() => [] as ScoreboardGame[]);
        })
      );

      for (const apiGames of batchResults) {
        if (apiGames && apiGames.length > 0) {
          games.push(...apiGames.map(mapToNormalizedGame));
        }
        if (games.length >= 6) break;
      }
    }

    if (games.length > 6) {
      games = games.slice(0, 6);
    }
  } catch {
    // If error, games will remain empty
  }

  return (
    <section>
      <ScoreboardBar games={games} />
    </section>
  );
}
