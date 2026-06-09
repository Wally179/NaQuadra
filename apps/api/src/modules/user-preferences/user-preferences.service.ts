// ============================================================
// Na Quadra — User Preferences Service
// ============================================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { NotificationPreferencesEntity } from './entities/notification-preferences.entity';
import { ContentPreferencesEntity } from './entities/content-preferences.entity';
import {
  UpdateNbaPreferencesDto,
  UpdateNotificationPreferencesDto,
  UpdateContentPreferencesDto,
  OnboardingDto,
} from './dto/update-preferences.dto';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(NotificationPreferencesEntity)
    private readonly notificationPrefsRepo: Repository<NotificationPreferencesEntity>,
    @InjectRepository(ContentPreferencesEntity)
    private readonly contentPrefsRepo: Repository<ContentPreferencesEntity>,
  ) {}

  async getPreferences(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    let notificationPrefs = await this.notificationPrefsRepo.findOne({ where: { userId } });
    if (!notificationPrefs) {
      notificationPrefs = this.notificationPrefsRepo.create({ userId });
      await this.notificationPrefsRepo.save(notificationPrefs);
    }

    let contentPrefs = await this.contentPrefsRepo.findOne({ where: { userId } });
    if (!contentPrefs) {
      contentPrefs = this.contentPrefsRepo.create({ userId });
      await this.contentPrefsRepo.save(contentPrefs);
    }

    return {
      nba: {
        favoriteTeamId: user.favoriteTeamId,
        followedTeamIds: user.followedTeamIds || [],
        favoritePlayerIds: user.favoritePlayerIds || [],
        onboardingCompleted: user.onboardingCompleted,
      },
      notifications: notificationPrefs,
      content: contentPrefs,
    };
  }

  async updateNbaPreferences(userId: string, dto: UpdateNbaPreferencesDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.favoriteTeamId !== undefined) user.favoriteTeamId = dto.favoriteTeamId;
    if (dto.followedTeamIds !== undefined) user.followedTeamIds = dto.followedTeamIds;
    if (dto.favoritePlayerIds !== undefined) user.favoritePlayerIds = dto.favoritePlayerIds;

    await this.userRepo.save(user);
    return this.getPreferences(userId);
  }

  async updateNotificationPreferences(userId: string, dto: UpdateNotificationPreferencesDto) {
    let prefs = await this.notificationPrefsRepo.findOne({ where: { userId } });
    if (!prefs) {
      prefs = this.notificationPrefsRepo.create({ userId });
    }
    Object.assign(prefs, dto);
    await this.notificationPrefsRepo.save(prefs);
    return this.getPreferences(userId);
  }

  async updateContentPreferences(userId: string, dto: UpdateContentPreferencesDto) {
    let prefs = await this.contentPrefsRepo.findOne({ where: { userId } });
    if (!prefs) {
      prefs = this.contentPrefsRepo.create({ userId });
    }
    Object.assign(prefs, dto);
    await this.contentPrefsRepo.save(prefs);
    return this.getPreferences(userId);
  }

  async completeOnboarding(userId: string, dto: OnboardingDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.favoriteTeamId !== undefined) user.favoriteTeamId = dto.favoriteTeamId;
    if (dto.followedTeamIds !== undefined) user.followedTeamIds = dto.followedTeamIds;
    if (dto.favoritePlayerIds !== undefined) user.favoritePlayerIds = dto.favoritePlayerIds;
    
    user.onboardingCompleted = true;

    await this.userRepo.save(user);
    return this.getPreferences(userId);
  }
}
