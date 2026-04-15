// ============================================================
// Na Quadra — Shared Types: Glossary
// ============================================================

export type GlossaryCategory = 'plays' | 'positions' | 'stats' | 'rules' | 'culture' | 'competition';
export type GlossaryDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface GlossaryEntry {
  id: string;
  term: string;
  slug: string;
  shortDefinition: string;
  fullDefinition?: string;
  category: GlossaryCategory;
  relatedTerms: string[];
  difficulty: GlossaryDifficulty;
}
