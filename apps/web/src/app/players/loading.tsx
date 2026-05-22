export default function PlayerLoading() {
  return (
    <div style={{ maxWidth: 'var(--nq-container-md)', margin: '0 auto', padding: 'var(--nq-space-8) var(--nq-space-4)' }}>
      {/* Player Header Skeleton */}
      <div style={{ display: 'flex', gap: 'var(--nq-space-6)', alignItems: 'center', marginBottom: 'var(--nq-space-8)' }}>
        <div style={{ height: '120px', width: '120px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nq-space-2)' }}>
          <div style={{ height: '36px', width: '250px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: '20px', width: '150px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)', animation: 'pulse 1.5s infinite' }} />
        </div>
      </div>
      
      {/* Stats Skeleton */}
      <div style={{ display: 'flex', gap: 'var(--nq-space-4)' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ height: '80px', flex: 1, backgroundColor: 'var(--nq-bg-elevated)', borderRadius: 'var(--nq-radius-lg)', animation: 'pulse 1.5s infinite' }} />
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
