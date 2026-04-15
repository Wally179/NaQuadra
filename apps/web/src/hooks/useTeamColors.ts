// ============================================================
// Na Quadra — Hook: useTeamColors
// ============================================================
// Returns team colors and CSS custom properties for contextual theming.
// This is the core mechanism for the team-color-as-context design system.

'use client';

import { useMemo } from 'react';
import { getTeamColors } from '@/data/teams';
import type { CSSProperties } from 'react';

interface TeamColorContext {
  primary: string;
  secondary: string;
  cssVars: CSSProperties;
}

export function useTeamColors(teamId: string | null | undefined): TeamColorContext | null {
  return useMemo(() => {
    if (!teamId) return null;

    const colors = getTeamColors(teamId);
    if (!colors) return null;

    return {
      primary: colors.primary,
      secondary: colors.secondary,
      cssVars: {
        '--team-primary': colors.primary,
        '--team-secondary': colors.secondary,
        '--team-glow': `${colors.primary}40`,
        '--team-gradient': `linear-gradient(135deg, ${colors.primary}33 0%, transparent 50%)`,
      } as CSSProperties,
    };
  }, [teamId]);
}
