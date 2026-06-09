// ============================================================
// Na Quadra — Personalization Service
// ============================================================
import { Injectable, Logger } from '@nestjs/common';
import type { NormalizedArticle, GameSummary } from '@naquadra/types';

interface UserPrefsForScoring {
  favoriteTeamId?: string | null;
  followedTeamIds?: string[];
  favoritePlayerIds?: string[];
}

@Injectable()
export class PersonalizationService {
  private readonly logger = new Logger(PersonalizationService.name);

  // ── Relevance Scoring ──

  public calculateArticleRelevance(article: NormalizedArticle, prefs: UserPrefsForScoring): number {
    let score = 0;

    const favoriteTeam = prefs.favoriteTeamId?.toLowerCase();
    const followedTeams = prefs.followedTeamIds?.map(id => id.toLowerCase()) || [];
    const favoritePlayers = prefs.favoritePlayerIds?.map(id => id.toLowerCase()) || [];

    // Check Teams
    if (favoriteTeam && article.relatedTeams?.includes(favoriteTeam)) {
      score += 100;
    }
    
    let hasFollowedTeam = false;
    for (const team of followedTeams) {
      if (article.relatedTeams?.includes(team)) {
        hasFollowedTeam = true;
        break;
      }
    }
    if (hasFollowedTeam) score += 50;

    // Check Players
    let hasFavoritePlayer = false;
    for (const player of favoritePlayers) {
      if (article.relatedPlayers?.includes(player)) {
        hasFavoritePlayer = true;
        break;
      }
    }
    if (hasFavoritePlayer) score += 75;

    // Textual heuristics if related tags are missing
    const textToSearch = `${article.title} ${article.summary || ''} ${article.content || ''}`.toLowerCase();
    
    // Fallback search for favorite team name or abbr
    if (favoriteTeam && score < 100) {
      if (textToSearch.includes(favoriteTeam)) {
         score += 60;
      }
    }

    return score;
  }

  public sortNewsByRelevance(articles: NormalizedArticle[], prefs: UserPrefsForScoring): NormalizedArticle[] {
    if (!prefs.favoriteTeamId && (!prefs.followedTeamIds || prefs.followedTeamIds.length === 0) && (!prefs.favoritePlayerIds || prefs.favoritePlayerIds.length === 0)) {
      return articles; // No preferences, return as is
    }

    return [...articles].sort((a, b) => {
      const scoreA = this.calculateArticleRelevance(a, prefs);
      const scoreB = this.calculateArticleRelevance(b, prefs);
      
      if (scoreA !== scoreB) {
        return scoreB - scoreA; // Descending
      }
      
      // Fallback to date
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }

  public sortGamesByRelevance(games: GameSummary[], prefs: UserPrefsForScoring): GameSummary[] {
    if (!prefs.favoriteTeamId && (!prefs.followedTeamIds || prefs.followedTeamIds.length === 0)) {
      return games;
    }

    const favoriteTeam = prefs.favoriteTeamId?.toLowerCase();
    const followedTeams = prefs.followedTeamIds?.map(id => id.toLowerCase()) || [];

    return [...games].sort((a, b) => {
      const isAFav = a.homeTeam.id.toLowerCase() === favoriteTeam || a.awayTeam.id.toLowerCase() === favoriteTeam;
      const isBFav = b.homeTeam.id.toLowerCase() === favoriteTeam || b.awayTeam.id.toLowerCase() === favoriteTeam;

      if (isAFav && !isBFav) return -1;
      if (!isAFav && isBFav) return 1;

      const isAFollowed = followedTeams.includes(a.homeTeam.id.toLowerCase()) || followedTeams.includes(a.awayTeam.id.toLowerCase());
      const isBFollowed = followedTeams.includes(b.homeTeam.id.toLowerCase()) || followedTeams.includes(b.awayTeam.id.toLowerCase());

      if (isAFollowed && !isBFollowed) return -1;
      if (!isAFollowed && isBFollowed) return 1;

      // Maintain original order (usually chronological)
      return 0;
    });
  }
}
