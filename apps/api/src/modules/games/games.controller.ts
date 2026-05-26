// ============================================================
// Na Quadra — Games Controller
// REST endpoints for games, box scores, plays, and previews.
// ============================================================
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { GameStatsService } from './game-stats.service';
import { LiveGamesService } from './live-games.service';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(
    private readonly gamesService: GamesService,
    private readonly gameStatsService: GameStatsService,
    private readonly liveGamesService: LiveGamesService,
  ) {}

  @Get('scoreboard')
  @ApiOperation({ summary: 'Scoreboard NBA (hoje ou data específica) — formato GameSummary' })
  @ApiQuery({ name: 'date', required: false, description: 'Formato: YYYYMMDD' })
  @ApiQuery({ name: 'format', required: false, description: 'flat = formato legado (NormalizedScore)' })
  @ApiResponse({ status: 200, description: 'Lista de jogos' })
  async getScoreboard(@Query('date') date?: string, @Query('format') format?: string) {
    // Legacy flat format for homepage ScoreboardBar
    if (format === 'flat') {
      const games = await this.gamesService.getScoreboardLegacy(date);
      return { data: games, meta: { total: games.length } };
    }
    // New GameSummary format for /games page
    const games = await this.gamesService.getScoreboard(date);
    return { data: games, meta: { total: games.length } };
  }

  @Get(':gameId')
  @ApiOperation({ summary: 'Detalhe completo de um jogo (pré/live/pós)' })
  @ApiParam({ name: 'gameId', description: 'ESPN Event ID' })
  @ApiResponse({ status: 200, description: 'GameDetail completo' })
  @ApiResponse({ status: 404, description: 'Jogo não encontrado' })
  async getGameDetail(@Param('gameId') gameId: string) {
    const detail = await this.gamesService.getGameDetail(gameId);
    if (!detail) {
      return { data: null, error: 'Game not found' };
    }
    return { data: detail };
  }

  @Get(':gameId/boxscore')
  @ApiOperation({ summary: 'Box score de jogadores de um jogo' })
  @ApiParam({ name: 'gameId', description: 'ESPN Event ID' })
  @ApiResponse({ status: 200, description: 'GamePlayerStatsGroup' })
  async getBoxScore(@Param('gameId') gameId: string) {
    const stats = await this.gameStatsService.getPlayerStats(gameId, false);
    return { data: stats };
  }

  @Get(':gameId/plays')
  @ApiOperation({ summary: 'Play-by-play de um jogo' })
  @ApiParam({ name: 'gameId', description: 'ESPN Event ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número máximo de plays (padrão: 50)' })
  @ApiResponse({ status: 200, description: 'Lista de GamePlayByPlayEvent' })
  async getPlays(
    @Param('gameId') gameId: string,
    @Query('limit') limit?: string,
  ) {
    const plays = await this.liveGamesService.getPlayByPlay(gameId, false);
    const maxPlays = limit ? parseInt(limit, 10) : 50;
    return { data: plays.slice(0, maxPlays), meta: { total: plays.length } };
  }

  @Get(':gameId/team-stats')
  @ApiOperation({ summary: 'Stats comparativas dos times' })
  @ApiParam({ name: 'gameId', description: 'ESPN Event ID' })
  @ApiResponse({ status: 200, description: 'GameTeamStatsComparison' })
  async getTeamStats(@Param('gameId') gameId: string) {
    const stats = await this.gameStatsService.getTeamStats(gameId, false);
    return { data: stats };
  }
}
