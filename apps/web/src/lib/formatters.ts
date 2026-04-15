// ============================================================
// Na Quadra — Utility: Date & Time Formatters
// ============================================================

/**
 * Formata uma data ISO para horário brasileiro (BRT/BRST).
 * Exemplo: "23:30"
 */
export function formatToBRT(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
}

/**
 * Formata uma data ISO para data curta brasileira.
 * Exemplo: "15 Abr"
 */
export function formatDateShort(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    timeZone: 'America/Sao_Paulo',
  });
}

/**
 * Formata "há X tempo" relativo.
 * Exemplo: "há 3h", "há 2 dias"
 */
export function formatRelativeTime(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `há ${diffMins}min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays}d`;
  return formatDateShort(isoDate);
}

/**
 * Traduz a fase da temporada para português.
 */
export function translatePhase(phase: string): string {
  const phases: Record<string, string> = {
    preseason: 'PRÉ-TEMPORADA',
    regular: 'TEMPORADA REGULAR',
    'play-in': 'PLAY-IN',
    'first-round': 'PRIMEIRO ROUND',
    'conference-semis': 'SEMIFINAL DE CONFERÊNCIA',
    'conference-finals': 'FINAL DE CONFERÊNCIA',
    finals: 'FINAIS DA NBA',
  };
  return phases[phase] || phase.toUpperCase();
}
