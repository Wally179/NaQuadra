// ============================================================
// Na Quadra — Shared Types: Notification
// ============================================================

export type NotificationType = 'news' | 'game-start' | 'game-final' | 'favorite-update' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  entityType?: 'team' | 'player' | 'game' | 'article';
  entityId?: string;
  createdAt: string;
}
