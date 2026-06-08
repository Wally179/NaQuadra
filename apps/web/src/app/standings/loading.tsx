// ============================================================
// Na Quadra — Standings Loading (Skeleton)
// Uses reusable Skeleton components for consistent UX.
// ============================================================

import { Skeleton, SkeletonText } from '@/components/ui/Skeleton/Skeleton';

export default function StandingsLoading() {
  return (
    <div style={{ maxWidth: 'var(--nq-container-md)', margin: '0 auto', padding: 'var(--nq-space-8) var(--nq-space-4)' }}>
      {/* Header */}
      <Skeleton width={200} height={40} style={{ marginBottom: 'var(--nq-space-2)' }} />
      <Skeleton width={300} height={20} style={{ marginBottom: 'var(--nq-space-8)' }} />
      
      {/* Conference Tabs */}
      <div style={{ display: 'flex', gap: 'var(--nq-space-4)', marginBottom: 'var(--nq-space-6)' }}>
        <Skeleton width={150} height={36} borderRadius="var(--nq-radius-md)" />
        <Skeleton width={150} height={36} borderRadius="var(--nq-radius-md)" />
      </div>

      {/* Table Header */}
      <div style={{ 
        display: 'flex', 
        gap: 'var(--nq-space-4)', 
        padding: 'var(--nq-space-3) var(--nq-space-4)',
        borderBottom: '1px solid var(--nq-border-subtle)',
        marginBottom: '1px',
      }}>
        <Skeleton width={24} height={14} borderRadius="var(--nq-radius-sm)" />
        <Skeleton width={140} height={14} borderRadius="var(--nq-radius-sm)" />
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--nq-space-6)' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width={28} height={14} borderRadius="var(--nq-radius-sm)" />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--nq-border-subtle)', borderRadius: 'var(--nq-radius-lg)', overflow: 'hidden' }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--nq-space-4)',
            padding: 'var(--nq-space-3) var(--nq-space-4)',
            backgroundColor: 'var(--nq-bg-elevated)',
            height: '52px',
          }}>
            <Skeleton width={20} height={16} borderRadius="var(--nq-radius-sm)" />
            <Skeleton width={28} height={28} borderRadius="50%" />
            <Skeleton width={120} height={16} borderRadius="var(--nq-radius-sm)" />
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 'var(--nq-space-6)' }}>
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} width={28} height={14} borderRadius="var(--nq-radius-sm)" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--nq-space-6)', marginTop: 'var(--nq-space-4)' }}>
        <Skeleton width={200} height={12} borderRadius="var(--nq-radius-sm)" />
        <Skeleton width={120} height={12} borderRadius="var(--nq-radius-sm)" />
      </div>
    </div>
  );
}
