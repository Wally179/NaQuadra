export default function StandingsLoading() {
  return (
    <div style={{ maxWidth: 'var(--nq-container-md)', margin: '0 auto', padding: 'var(--nq-space-8) var(--nq-space-4)' }}>
      {/* Header Skeleton */}
      <div style={{ height: '40px', width: '200px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)', marginBottom: 'var(--nq-space-2)', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '20px', width: '300px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)', marginBottom: 'var(--nq-space-8)', animation: 'pulse 1.5s infinite' }} />
      
      {/* Tabs Skeleton */}
      <div style={{ display: 'flex', gap: 'var(--nq-space-4)', marginBottom: 'var(--nq-space-6)' }}>
        <div style={{ height: '36px', width: '120px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '36px', width: '120px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)', animation: 'pulse 1.5s infinite' }} />
      </div>

      {/* Table Skeleton */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: 'var(--nq-border-subtle)', borderRadius: 'var(--nq-radius-lg)', overflow: 'hidden' }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{ height: '60px', backgroundColor: 'var(--nq-bg-elevated)', animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
