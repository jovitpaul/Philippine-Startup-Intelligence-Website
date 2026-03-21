export default function Loading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: '50px', height: '50px', border: '4px solid #cbd5e1', borderTop: '4px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <h2 style={{ marginTop: '24px', color: '#0f172a', fontSize: '20px', fontWeight: '700' }}>📡 Scanning Live Market Signals...</h2>
      <p style={{ color: '#64748b', marginTop: '8px' }}>Accessing Philippine Startup Database</p>
      
      {/* This adds the spinning animation */}
      <style>{`
        @keyframes spin { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
}