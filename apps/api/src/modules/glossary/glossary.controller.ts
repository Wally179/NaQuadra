// ============================================================
// Na Quadra — Glossary Controller
// ============================================================
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { GlossaryService } from './glossary.service';

@ApiTags('glossary')
@Controller('glossary')
export class GlossaryController {
  constructor(private readonly glossaryService: GlossaryService) {}

  @Get()
  @ApiOperation({ summary: 'Listar termos do glossário' })
  @ApiQuery({ name: 'category', required: false, enum: ['plays', 'positions', 'stats', 'rules', 'culture', 'competition'] })
  @ApiQuery({ name: 'difficulty', required: false, enum: ['beginner', 'intermediate', 'advanced'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'Lista de termos' })
  async findAll(
    @Query('category') category?: string,
    @Query('difficulty') difficulty?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.glossaryService.findAll({ category, difficulty, search });
    return { data, meta: { total: data.length } };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Termo por slug' })
  @ApiResponse({ status: 200, description: 'Dados do termo' })
  @ApiResponse({ status: 404, description: 'Termo não encontrado' })
  async findBySlug(@Param('slug') slug: string) {
    const entry = await this.glossaryService.findBySlug(slug);
    return { data: entry };
  }
}
