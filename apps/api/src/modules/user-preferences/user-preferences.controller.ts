// ============================================================
// Na Quadra — User Preferences Controller
// ============================================================
import { Controller, Get, Patch, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserPreferencesService } from './user-preferences.service';
import { JwtAuthGuard, CurrentUser } from '../auth/guards/auth.guards';
import {
  UpdateNbaPreferencesDto,
  UpdateNotificationPreferencesDto,
  UpdateContentPreferencesDto,
  OnboardingDto,
} from './dto/update-preferences.dto';

@ApiTags('user-preferences')
@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserPreferencesController {
  constructor(private readonly prefsService: UserPreferencesService) {}

  @Get()
  @ApiOperation({ summary: 'Obter todas as preferências do usuário' })
  async getPreferences(@CurrentUser('id') userId: string) {
    const data = await this.prefsService.getPreferences(userId);
    return { data };
  }

  @Patch('nba')
  @ApiOperation({ summary: 'Atualizar preferências da NBA (times/jogadores)' })
  async updateNbaPreferences(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateNbaPreferencesDto,
  ) {
    const data = await this.prefsService.updateNbaPreferences(userId, dto);
    return { data };
  }

  @Patch('notifications')
  @ApiOperation({ summary: 'Atualizar preferências de notificação' })
  async updateNotificationPreferences(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    const data = await this.prefsService.updateNotificationPreferences(userId, dto);
    return { data };
  }

  @Patch('content')
  @ApiOperation({ summary: 'Atualizar preferências de conteúdo' })
  async updateContentPreferences(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateContentPreferencesDto,
  ) {
    const data = await this.prefsService.updateContentPreferences(userId, dto);
    return { data };
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Concluir onboarding de preferências' })
  async completeOnboarding(
    @CurrentUser('id') userId: string,
    @Body() dto: OnboardingDto,
  ) {
    const data = await this.prefsService.completeOnboarding(userId, dto);
    return { data };
  }
}
