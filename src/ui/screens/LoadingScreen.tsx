import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Assets } from 'pixi.js';

const ASSETS_TO_LOAD = [
  '/assets/player.png',
  '/assets/chaser.png',
  '/assets/shooter.png',
  '/assets/background.png',
  '/assets/island.png'
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        await Assets.load(ASSETS_TO_LOAD, (p) => {
          if (isMounted) setProgress(p);
        });
        if (isMounted) navigate('/game');
      } catch (err) {
        console.error("Failed to load assets", err);
        // Fallback to game anyway
        if (isMounted) navigate('/game');
      }
    }

    load();
    return () => { isMounted = false; };
  }, [navigate]);

  return (
    <main style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100vh', width: '100vw', background: '#0f172a', color: 'white', fontFamily: 'monospace'
    }}>
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '300px' }}>
        <h2 style={{ margin: 0, color: '#60a5fa' }}>LOADING ASSETS</h2>
        <div style={{ width: '100%', height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${progress * 100}%`, height: '100%', background: '#3b82f6', transition: 'width 0.1s linear' }}></div>
        </div>
        <span>{Math.round(progress * 100)}%</span>
      </div>
    </main>
  );
}
