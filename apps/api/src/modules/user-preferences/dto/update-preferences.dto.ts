// ============================================================
// Na Quadra — DTOs: User Preferences
// ============================================================
import { IsBoolean, IsString, IsArray, IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNbaPreferencesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  favoriteTeamId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  followedTeamIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoritePlayerIds?: string[];
}

export class UpdateNotificationPreferencesDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() favoriteTeamNews?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() injuries?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() trades?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() signings?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() preGame60min?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() preGame30min?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() gameStarted?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() gameFinal?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() personalizedNews?: boolean;
}

export class UpdateContentPreferencesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['east', 'west', 'both'])
  preferredConference?: 'east' | 'west' | 'both';

  @ApiPropertyOptional() @IsOptional() @IsBoolean() showScoresOnHome?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() compactView?: boolean;
}

export class OnboardingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  favoriteTeamId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  followedTeamIds?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  favoritePlayerIds?: string[];
}
