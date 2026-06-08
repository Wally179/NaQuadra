// ============================================================
// Na Quadra — Player Page Loading (Skeleton)
// Uses reusable Skeleton components.
// ============================================================

import { Skeleton, SkeletonCircle } from '@/components/ui/Skeleton/Skeleton';

export default function PlayerLoading() {
  return (
    <div style={{ maxWidth: 'var(--nq-container-md)', margin: '0 auto', padding: 'var(--nq-space-8) var(--nq-space-4)' }}>
      {/* Hero section */}
      <div style={{
        display: 'flex',
        gap: 'var(--nq-space-6)',
        alignItems: 'center',
        marginBottom: 'var(--nq-space-8)',
        padding: 'var(--nq-space-6)',
        backgroundColor: 'var(--nq-bg-secondary)',
        borderRadius: 'var(--nq-radius-xl)',
      }}>
        <SkeletonCircle size={120} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nq-space-2)' }}>
          <Skeleton width={40} height={16} borderRadius="var(--nq-radius-sm)" />
          <Skeleton width={250} height={36} borderRadius="var(--nq-radius-md)" />
          <div style={{ display: 'flex', gap: 'var(--nq-space-2)' }}>
            <Skeleton width={80} height={24} borderRadius="var(--nq-radius-full)" />
            <Skeleton width={100} height={24} borderRadius="var(--nq-radius-full)" />
            <Skeleton width={60} height={24} borderRadius="var(--nq-radius-full)" />
          </div>
        </div>
      </div>

      {/* Stats section */}
      <Skeleton width={160} height={24} style={{ marginBottom: 'var(--nq-space-4)' }} />
      <div style={{ display: 'flex', gap: 'var(--nq-space-4)', marginBottom: 'var(--nq-space-8)' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            flex: 1,
            padding: 'var(--nq-space-4)',
            backgroundColor: 'var(--nq-bg-secondary)',
            borderRadius: 'var(--nq-radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--nq-space-2)',
          }}>
            <Skeleton width={48} height={32} borderRadius="var(--nq-radius-sm)" />
            <Skeleton width={30} height={14} borderRadius="var(--nq-radius-sm)" />
          </div>
        ))}
      </div>

      {/* Shooting stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nq-space-3)' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--nq-space-3)',
            padding: 'var(--nq-space-3)',
            backgroundColor: 'var(--nq-bg-secondary)',
            borderRadius: 'var(--nq-radius-md)',
          }}>
            <Skeleton width={36} height={14} borderRadius="var(--nq-radius-sm)" />
            <Skeleton width="100%" height={8} borderRadius="var(--nq-radius-full)" style={{ flex: 1 }} />
            <Skeleton width={50} height={14} borderRadius="var(--nq-radius-sm)" />
          </div>
        ))}
      </div>
    </div>
  );
}
