// ============================================================
// Na Quadra — Standings Controller
// ============================================================
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { StandingsService } from './standings.service';

@ApiTags('standings')
@Controller('standings')
export class StandingsController {
  constructor(private readonly standingsService: StandingsService) {}

  @Get()
  @ApiOperation({ summary: 'Standings NBA por conferência' })
  @ApiQuery({ name: 'conference', required: false, enum: ['east', 'west'] })
  @ApiResponse({ status: 200, description: 'Classificação' })
  async getStandings(@Query('conference') conference?: string) {
    const data = await this.standingsService.getStandings(conference);
    return { data, meta: { total: data.length } };
  }
}
