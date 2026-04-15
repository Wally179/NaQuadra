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
  discoveryMode: boolean;
  createdAt: string;
  updatedAt: string;
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
