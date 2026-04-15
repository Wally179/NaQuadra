// ============================================================
// Na Quadra — Articles Controller
// ============================================================
import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/guards/auth.guards';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar artigos (paginado)' })
  @ApiQuery({ name: 'category', required: false, enum: ['news', 'analysis', 'feature', 'explainer'] })
  @ApiQuery({ name: 'teamId', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Lista de artigos' })
  async findAll(
    @Query('category') category?: string,
    @Query('teamId') teamId?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.articlesService.findAll({ category, teamId, search, page, limit });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Artigo por slug' })
  @ApiResponse({ status: 200, description: 'Dados do artigo' })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado' })
  async findBySlug(@Param('slug') slug: string) {
    const article = await this.articlesService.findBySlug(slug);
    return { data: article };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar artigo (editor/admin)' })
  @ApiResponse({ status: 201, description: 'Artigo criado' })
  async create(@Body() body: Record<string, unknown>) {
    const article = await this.articlesService.create(body);
    return { data: article };
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar artigo (editor/admin)' })
  async update(@Param('slug') slug: string, @Body() body: Record<string, unknown>) {
    const article = await this.articlesService.update(slug, body);
    return { data: article };
  }
}
