// ============================================================
// Na Quadra — News Controller (ESPN Integration)
// ============================================================
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AggregatedNewsService } from './aggregated-news.service';
import { UserPreferencesService } from '../user-preferences/user-preferences.service';
import { PersonalizationService } from '../personalization/personalization.service';
import { JwtAuthGuard, CurrentUser } from '../auth/guards/auth.guards';

@ApiTags('articles')
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: AggregatedNewsService,
    private readonly userPreferencesService: UserPreferencesService,
    private readonly personalizationService: PersonalizationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as notícias recentes (feed global)' })
  @ApiResponse({ status: 200, description: 'Feed de notícias global' })
  async getNews() {
    const data = await this.newsService.getNews();
    return { data };
  }

  @Get('personalized')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar notícias recentes personalizadas para o usuário' })
  @ApiResponse({ status: 200, description: 'Feed de notícias ordenado por relevância' })
  async getPersonalizedNews(@CurrentUser('id') userId: string) {
    const prefsData = await this.userPreferencesService.getPreferences(userId);
    const prefs = {
      favoriteTeamId: prefsData.nba.favoriteTeamId,
      followedTeamIds: prefsData.nba.followedTeamIds,
      favoritePlayerIds: prefsData.nba.favoritePlayerIds,
    };
    const articles = await this.newsService.getNews();
    const data = this.personalizationService.sortNewsByRelevance(articles, prefs);
    return { data };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Obter artigo detalhado por slug' })
  @ApiResponse({ status: 200, description: 'Detalhes da notícia' })
  @ApiResponse({ status: 404, description: 'Notícia não encontrada' })
  async getNewsArticle(@Param('slug') slug: string) {
    const data = await this.newsService.getNewsArticleBySlug(slug);
    if (!data) {
      return { data: null, error: 'Article not found' };
    }
    return { data };
  }
}
