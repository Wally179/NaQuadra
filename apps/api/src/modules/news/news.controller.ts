// ============================================================
// Na Quadra — News Controller (ESPN Integration)
// ============================================================
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AggregatedNewsService } from './aggregated-news.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: AggregatedNewsService) {}

  @Get()
  @ApiOperation({ summary: 'Últimas notícias agregadas (ESPN, NewsAPI, GNews)' })
  @ApiResponse({ status: 200, description: 'Lista de notícias mais recentes' })
  async getNews() {
    const articles = await this.newsService.getNews();

    return { data: articles, meta: { total: articles.length } };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Detalhes de uma notícia por slug' })
  @ApiResponse({ status: 200, description: 'Dados da notícia' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  async getNewsArticle(@Param('slug') slug: string) {
    const article = await this.newsService.getNewsArticleBySlug(slug);
    if (!article) {
      throw new NotFoundException(`Notícia '${slug}' não encontrada`);
    }
    return { data: article };
  }
}
