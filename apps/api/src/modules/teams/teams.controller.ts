// ============================================================
// Na Quadra — Teams Controller
// ============================================================
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TeamsService } from './teams.service';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os times' })
  @ApiQuery({ name: 'conference', required: false, enum: ['east', 'west'] })
  @ApiResponse({ status: 200, description: 'Lista de times' })
  async findAll(@Query('conference') conference?: string) {
    const teams = await this.teamsService.findAll(conference);
    return { data: teams, meta: { total: teams.length } };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes de um time' })
  @ApiResponse({ status: 200, description: 'Dados do time' })
  @ApiResponse({ status: 404, description: 'Time não encontrado' })
  async findById(@Param('id') id: string) {
    const team = await this.teamsService.findById(id);
    return { data: team };
  }
}
