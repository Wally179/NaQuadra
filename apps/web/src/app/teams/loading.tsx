export default function TeamLoading() {
  return (
    <div style={{ maxWidth: 'var(--nq-container-lg)', margin: '0 auto', padding: 'var(--nq-space-8) var(--nq-space-4)' }}>
      {/* Team Header Skeleton */}
      <div style={{ display: 'flex', gap: 'var(--nq-space-6)', alignItems: 'center', marginBottom: 'var(--nq-space-8)' }}>
        <div style={{ height: '100px', width: '100px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nq-space-2)' }}>
          <div style={{ height: '40px', width: '300px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: '20px', width: '200px', backgroundColor: 'var(--nq-bg-secondary)', borderRadius: 'var(--nq-radius-md)', animation: 'pulse 1.5s infinite' }} />
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--nq-space-8)' }}>
        <div style={{ height: '400px', backgroundColor: 'var(--nq-bg-elevated)', borderRadius: 'var(--nq-radius-lg)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '400px', backgroundColor: 'var(--nq-bg-elevated)', borderRadius: 'var(--nq-radius-lg)', animation: 'pulse 1.5s infinite' }} />
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
