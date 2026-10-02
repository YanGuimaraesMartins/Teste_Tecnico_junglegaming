import { useLocation, Link } from 'react-router-dom';

export default function ResultScreen() {
  const location = useLocation();
  const state = location.state as { score?: number; timeRemaining?: number; endReason?: string } | null;

  const score = state?.score ?? 0;
  const time = state?.timeRemaining ?? 0;
  const reason = state?.endReason ?? 'unknown';

  const timeSurvived = Math.max(0, 180 - Math.ceil(time / 1000)); // assuming 180s was max

  return (
    <main style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%',
      backgroundImage: 'radial-gradient(circle at center, #7f1d1d 0%, #450a0a 100%)',
    }}>
      <div className="glass-panel" style={{
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        minWidth: '400px',
        animation: 'slideIn 0.4s ease-out'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          margin: 0, 
          color: '#f87171',
          textShadow: '0 0 20px rgba(248, 113, 113, 0.4)'
        }}>
          GAME OVER
        </h1>
        
        <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '1.2rem', textTransform: 'uppercase' }}>
          Reason: <span style={{ color: 'white' }}>{reason}</span>
        </p>

        <div style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem' }}>
            <span>Final Score:</span>
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{score}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#9ca3af' }}>
            <span>Time Survived:</span>
            <span>{timeSurvived}s</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1.5rem' }}>
          <Link to="/" className="btn-secondary" style={{ flex: 1 }}>
            Main Menu
          </Link>
          <Link to="/game" className="btn-primary" style={{ flex: 1 }}>
            Play Again
          </Link>
        </div>
      </div>
    </main>
  );
}
