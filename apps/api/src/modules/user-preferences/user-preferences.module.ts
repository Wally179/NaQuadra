// ============================================================
// Na Quadra — User Preferences Module
// ============================================================
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../auth/entities/user.entity';
import { NotificationPreferencesEntity } from './entities/notification-preferences.entity';
import { ContentPreferencesEntity } from './entities/content-preferences.entity';
import { UserActivityEntity } from './entities/user-activity.entity';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesController } from './user-preferences.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      NotificationPreferencesEntity,
      ContentPreferencesEntity,
      UserActivityEntity,
    ]),
  ],
  controllers: [UserPreferencesController],
  providers: [UserPreferencesService],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
