// ============================================================
// Na Quadra — Shared Types: User
// ============================================================

export type UserRole = 'user' | 'editor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  avatarBase64?: string | null;
  discoveryMode: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  favoriteTeamNews: boolean;
  injuries: boolean;
  trades: boolean;
  signings: boolean;
  preGame60min: boolean;
  preGame30min: boolean;
  gameStarted: boolean;
  gameFinal: boolean;
  personalizedNews: boolean;
}

export interface ContentPreferences {
  preferredConference: 'east' | 'west' | 'both';
  showScoresOnHome: boolean;
  compactView: boolean;
}

export interface UserProfile extends User {
  favoriteTeamId?: string | null;
  followedTeamIds: string[];
  favoritePlayerIds: string[];
  notificationPreferences: NotificationPreferences;
  contentPreferences: ContentPreferences;
}

export interface UpdateProfileDto {
  name?: string;
  avatarBase64?: string | null;
  avatarUrl?: string | null;
}

export interface UpdatePasswordDto {
  currentPassword?: string; // Can be optional if user signed up via OAuth in future
  newPassword: string;
}

export interface NbaPreferencesDto {
  favoriteTeamId?: string | null;
  followedTeamIds?: string[];
  favoritePlayerIds?: string[];
}

export interface UserPreferences {
  preferredConference: 'east' | 'west' | 'both';
  emailNotifications: boolean;
  onboardingCompleted: boolean;
}

export interface Favorite {
  id: string;
  userId: string;
  entityType: 'team' | 'player';
  entityId: string;
  createdAt: string;
}
