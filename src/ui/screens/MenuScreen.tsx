import { Link } from 'react-router-dom';

export default function MenuScreen() {
  return (
    <main style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%',
      backgroundImage: 'radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)',
    }}>
      <div className="glass-panel" style={{
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        animation: 'slideIn 0.5s ease-out, float 6s ease-in-out infinite',
        minWidth: '400px'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          margin: 0, 
          background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
        }}>
          PIRATE BATTLE
        </h1>
        
        <p style={{ color: 'var(--color-text-muted)', margin: '0 0 1rem 0' }}>
          Phase 8: High Seas Await
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <Link to="/loading" className="btn-primary" style={{ width: '100%' }}>
            Start Game
          </Link>
          
          <Link to="/options" className="btn-secondary" style={{ width: '100%' }}>
            Options
          </Link>
          
          <Link to="/leaderboard" className="btn-secondary" style={{ width: '100%' }}>
            Rankings
          </Link>
        </div>
      </div>
    </main>
  );
}
