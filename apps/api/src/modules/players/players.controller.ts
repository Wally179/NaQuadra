// ============================================================
// Na Quadra — Players Controller
// ============================================================
import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PlayersService } from './players.service';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('team/:teamId')
  @ApiOperation({ summary: 'Elenco de um time' })
  async getTeamRoster(@Param('teamId') teamId: string) {
    const roster = await this.playersService.findByTeam(teamId);
    return { data: roster };
  }

  @Get(':playerId')
  @ApiOperation({ summary: 'Detalhes ou Pesquisa de jogador' })
  async getPlayer(@Param('playerId') playerId: string, @Query('q') q?: string) {
    if (playerId === 'search' && q) {
      const player = await this.playersService.findByQuery(q);
      return { data: player };
    }
    const player = await this.playersService.findById(playerId);
    return { data: player };
  }
}
