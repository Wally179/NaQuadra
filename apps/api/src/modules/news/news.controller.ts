// ============================================================
// Na Quadra — News Controller (ESPN Integration)
// ============================================================
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
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
    console.log('articles', articles)

    return { data: articles, meta: { total: articles.length } };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Detalhes de uma notícia por slug' })
  @ApiResponse({ status: 200, description: 'Dados da notícia' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  async getNewsArticle(@Param('slug') slug: string) {
    const article = await this.espnService.getNewsArticleBySlug(slug);
    if (!article) {
      throw new NotFoundException(`Notícia '${slug}' não encontrada`);
    }
    console.log('article', article)
    return { data: article };
  }
}
