// ============================================================
// Na Quadra — Favorites Controller
// ============================================================
import { Controller, Get, Post, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard, CurrentUser } from '../auth/guards/auth.guards';

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar favoritos do usuário' })
  @ApiQuery({ name: 'type', required: false, enum: ['team', 'player'] })
  @ApiResponse({ status: 200, description: 'Lista de favoritos' })
  async list(
    @CurrentUser('id') userId: string,
    @Query('type') type?: 'team' | 'player',
  ) {
    const data = type
      ? await this.favoritesService.findByUserAndType(userId, type)
      : await this.favoritesService.findByUser(userId);
    return { data };
  }

  @Post(':entityType/:entityId')
  @ApiOperation({ summary: 'Adicionar favorito' })
  @ApiResponse({ status: 201, description: 'Favorito adicionado' })
  @ApiResponse({ status: 409, description: 'Já é favorito' })
  async add(
    @CurrentUser('id') userId: string,
    @Param('entityType') entityType: 'team' | 'player',
    @Param('entityId') entityId: string,
  ) {
    const fav = await this.favoritesService.add(userId, entityType, entityId);
    return { data: fav };
  }

  @Delete(':entityType/:entityId')
  @ApiOperation({ summary: 'Remover favorito' })
  @ApiResponse({ status: 200, description: 'Favorito removido' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('entityType') entityType: 'team' | 'player',
    @Param('entityId') entityId: string,
  ) {
    return this.favoritesService.remove(userId, entityType, entityId);
  }

  @Get('check/:entityType/:entityId')
  @ApiOperation({ summary: 'Verificar se é favorito' })
  @ApiResponse({ status: 200, description: 'Status de favorito' })
  async check(
    @CurrentUser('id') userId: string,
    @Param('entityType') entityType: 'team' | 'player',
    @Param('entityId') entityId: string,
  ) {
    const isFavorite = await this.favoritesService.isFavorite(userId, entityType, entityId);
    return { data: { isFavorite } };
  }
}
