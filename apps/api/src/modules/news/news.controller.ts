// ============================================================
// Na Quadra — News Controller (ESPN Integration)
// ============================================================
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EspnService } from '../espn/espn.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly espnService: EspnService) {}

  @Get()
  @ApiOperation({ summary: 'Últimas notícias da NBA (via ESPN)' })
  @ApiResponse({ status: 200, description: 'Lista de notícias mais recentes' })
  async getNews() {
    const articles = await this.espnService.getNews();
    return { data: articles, meta: { total: articles.length } };
  }
}
