import { Link } from 'react-router-dom';

export default function MenuScreen() {
  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      padding: '16px',
      backgroundImage: 'radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)',
      touchAction: 'auto',
    }}>
      <div className="glass-panel" style={{
        padding: 'clamp(1.2rem, 4vw, 3rem)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        animation: 'slideIn 0.5s ease-out, float 6s ease-in-out infinite',
        width: '100%',
        maxWidth: '420px',
        touchAction: 'auto',
      }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 6vw, 3rem)',
          margin: 0,
          background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(59, 130, 246, 0.3)', whiteSpace: 'nowrap'
        }}>
          PIRATE BATTLE
        </h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', touchAction: 'auto' }}>
          <Link to="/loading" className="btn-primary" style={{ width: '100%', touchAction: 'auto', fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)' }}>
            Start Game
          </Link>

          <Link to="/options" className="btn-secondary" style={{ width: '100%', touchAction: 'auto', fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)' }}>
            Options
          </Link>

          <Link to="/leaderboard" className="btn-secondary" style={{ width: '100%', touchAction: 'auto', fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)' }}>
            Rankings
          </Link>
        </div>
      </div>
    </main>
  );
}

