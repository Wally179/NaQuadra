// ============================================================
// Na Quadra — Games Controller
// ============================================================
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GamesService } from './games.service';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('scoreboard')
  @ApiOperation({ summary: 'Scoreboard NBA (hoje ou data específica)' })
  @ApiQuery({ name: 'date', required: false, description: 'Formato: YYYYMMDD' })
  @ApiResponse({ status: 200, description: 'Lista de jogos' })
  async getScoreboard(@Query('date') date?: string) {
    const games = await this.gamesService.getScoreboard(date);
    return { data: games, meta: { total: games.length } };
  }
}
