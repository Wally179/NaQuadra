export default function GlobalLoading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh',
      width: '100%'
    }}>
      <div className="nq-spinner" style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--nq-border-subtle)',
        borderTopColor: 'var(--nq-system-info)',
        borderRadius: '50%',
        animation: 'nq-spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes nq-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{
        marginTop: 'var(--nq-space-4)',
        color: 'var(--nq-text-tertiary)',
        fontFamily: 'var(--nq-font-body)',
        fontSize: 'var(--nq-text-sm)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--nq-tracking-wide)'
      }}>
        Aquecendo...
      </p>
    </div>
  );
}
