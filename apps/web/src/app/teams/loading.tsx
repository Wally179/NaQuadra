// ============================================================
// Na Quadra — Teams Page Loading (Skeleton)
// Uses reusable Skeleton components.
// ============================================================

import { Skeleton } from '@/components/ui/Skeleton/Skeleton';

export default function TeamsLoading() {
  return (
    <div style={{ maxWidth: 'var(--nq-container-lg)', margin: '0 auto', padding: 'var(--nq-space-8) var(--nq-space-4)' }}>
      {/* Title */}
      <Skeleton width={120} height={40} style={{ marginBottom: 'var(--nq-space-2)' }} />
      <Skeleton width={220} height={18} style={{ marginBottom: 'var(--nq-space-8)' }} />

      {/* Conference sections */}
      {Array.from({ length: 2 }).map((_, c) => (
        <div key={c} style={{ marginBottom: 'var(--nq-space-8)' }}>
          {/* Conference title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--nq-space-3)', marginBottom: 'var(--nq-space-5)' }}>
            <Skeleton width={180} height={24} borderRadius="var(--nq-radius-sm)" />
            <Skeleton width={60} height={18} borderRadius="var(--nq-radius-full)" />
          </div>

          {/* Teams grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 'var(--nq-space-3)',
          }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--nq-space-3)',
                padding: 'var(--nq-space-3) var(--nq-space-4)',
                backgroundColor: 'var(--nq-bg-secondary)',
                borderRadius: 'var(--nq-radius-lg)',
                border: '1px solid var(--nq-border-subtle)',
              }}>
                <Skeleton width={44} height={44} borderRadius="var(--nq-radius-md)" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nq-space-1)' }}>
                  <Skeleton width={120} height={16} borderRadius="var(--nq-radius-sm)" />
                  <Skeleton width={80} height={12} borderRadius="var(--nq-radius-sm)" />
                  <Skeleton width={60} height={10} borderRadius="var(--nq-radius-sm)" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
