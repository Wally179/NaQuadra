// ============================================================
// Na Quadra — Scoreboard Section (Async Server Component)
// Fetches scoreboard data independently and streams via Suspense.
// When there are no upcoming games (offseason), it shows the
// last game played + a commemorative champion card.
// ============================================================

import { ScoreboardBar } from '@/components/features/scoreboard/ScoreboardBar/ScoreboardBar';
import { fetchScoreboard, type ScoreboardGame } from '@/lib/api';
import { addDays, subDays, format } from 'date-fns';
import type { NormalizedGame } from '@naquadra/types';
import type { ChampionInfo } from '@/components/features/scoreboard/ChampionCard/ChampionCard';

// ── Current NBA Champion data ──
// Updated after the NBA Finals conclude each season.
const CURRENT_CHAMPION: ChampionInfo = {
  teamId: 'nyk',
  season: '2025-26',
  seriesResult: '4-1 vs Spurs',
  mvp: 'Jalen Brunson',
};

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
  let isOffseason = false;

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

    // ── Offseason: no future games found ──
    // Search backwards for the last game played (up to 30 days back)
    if (games.length === 0) {
      isOffseason = true;
      const pastDaysToFetch = Array.from({ length: 30 }, (_, i) => i + 1);

      for (let batchStart = 0; batchStart < pastDaysToFetch.length && games.length === 0; batchStart += batchSize) {
        const batch = pastDaysToFetch.slice(batchStart, batchStart + batchSize);
        const batchResults = await Promise.all(
          batch.map((dayOffset) => {
            const targetDate = subDays(today, dayOffset);
            const dateStr = format(targetDate, 'yyyyMMdd');
            return fetchScoreboard(dateStr).catch(() => [] as ScoreboardGame[]);
          })
        );

        for (const apiGames of batchResults) {
          if (apiGames && apiGames.length > 0) {
            // Get only the last game from the most recent day with games
            const mapped = apiGames.map(mapToNormalizedGame);
            // Sort by start time descending to get the latest
            mapped.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
            // Take just the first (most recent) game
            games.push(mapped[0]);
            break;
          }
        }
      }
    }
  } catch {
    // If error, games will remain empty
  }

  return (
    <section>
      <ScoreboardBar
        games={games}
        isOffseason={isOffseason}
        champion={isOffseason ? CURRENT_CHAMPION : undefined}
      />
    </section>
  );
}
