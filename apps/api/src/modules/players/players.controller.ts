// ============================================================
// Na Quadra — Players Controller
// ============================================================
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PlayersService } from './players.service';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('team/:teamId')
  @ApiOperation({ summary: 'Elenco de um time (via ESPN)' })
  @ApiResponse({ status: 200, description: 'Lista de jogadores do time' })
  async getTeamRoster(@Param('teamId') teamId: string) {
    const roster = await this.playersService.findByTeam(teamId);
    return { data: roster };
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Pesquisar jogador' })
  @ApiResponse({ status: 200 })
  async searchPlayer(@Param('query') query: string) {
    const player = await this.playersService.findByQuery(query);
    return { data: player };
  }

  @Get(':playerId')
  @ApiOperation({ summary: 'Detalhes de um jogador (via ESPN)' })
  @ApiResponse({ status: 200, description: 'Dados do jogador' })
  @ApiResponse({ status: 404, description: 'Jogador não encontrado' })
  async getPlayer(@Param('playerId') playerId: string) {
    const player = await this.playersService.findById(playerId);
    return { data: player };
  }
}
