export default function NewsLoading() {
  return (
    <div style={{ maxWidth: 'var(--nq-container-xl)', margin: '0 auto', padding: 'var(--nq-space-8) var(--nq-space-4)' }}>
      {/* Header Skeleton */}
      <div style={{ height: '48px', width: '250px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)', marginBottom: 'var(--nq-space-8)', animation: 'pulse 1.5s infinite' }} />
      
      {/* Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--nq-space-6)' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nq-space-4)', backgroundColor: 'var(--nq-bg-elevated)', borderRadius: 'var(--nq-radius-lg)', padding: 'var(--nq-space-4)', animation: 'pulse 1.5s infinite' }}>
            <div style={{ height: '180px', width: '100%', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)' }} />
            <div style={{ height: '16px', width: '40%', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-sm)' }} />
            <div style={{ height: '24px', width: '90%', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-sm)' }} />
            <div style={{ height: '24px', width: '70%', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-sm)' }} />
            <div style={{ height: '14px', width: '30%', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-sm)', marginTop: 'auto' }} />
          </div>
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
