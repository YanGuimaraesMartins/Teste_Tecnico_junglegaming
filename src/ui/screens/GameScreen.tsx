import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { usePixiApp } from '../../game/hooks/usePixiApp';
import MobileControls from '../touch/MobileControls';
import { useSubmitMatch } from '../../api/hooks';

export default function GameScreen() {
  const { containerRef, score, timeRemaining, status, hp, engineRef } = usePixiApp();
  const navigate = useNavigate();
  const { mutate: submitMatch } = useSubmitMatch();
  const hasSubmitted = useRef(false);
  const mainRef = useRef<HTMLElement>(null);

  // Request fullscreen on mobile
  const requestFullscreen = useCallback(() => {
    const el = mainRef.current || document.documentElement;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;
    
    try {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      }
    } catch (_) { /* ignore */ }

    // Lock to landscape if supported
    try {
      if (screen.orientation && (screen.orientation as any).lock) {
        (screen.orientation as any).lock('landscape').catch(() => {});
      }
    } catch (_) { /* ignore */ }
  }, []);

  // Auto-fullscreen on first touch
  useEffect(() => {
    const handler = () => {
      requestFullscreen();
      document.removeEventListener('touchstart', handler);
    };
    document.addEventListener('touchstart', handler, { once: true });
    return () => document.removeEventListener('touchstart', handler);
  }, [requestFullscreen]);

  useEffect(() => {
    if (status === 'FINISHED' && engineRef.current) {
      const endReason = engineRef.current.endReason || 'death';
      
      if (!hasSubmitted.current) {
        hasSubmitted.current = true;
        const config = engineRef.current.config;
        
        submitMatch({
          matchId: uuidv4(),
          playerId: 'player-1',
          playerName: 'Guest',
          score,
          duration: Math.ceil((config.sessionDuration * 1000 - timeRemaining) / 1000),
          endReason: endReason === 'death' ? 'death' : 'timeout',
          config: {
            sessionDuration: config.sessionDuration,
            enemySpawnInterval: config.spawn.interval / 1000,
            arenaWidth: 800,
            arenaHeight: 600,
            seed: config.seed,
          }
        });
      }

      const timer = setTimeout(() => {
        navigate('/result', { state: { score, timeRemaining, endReason } });
      }, 1500);
      return () => { clearTimeout(timer); };
    }
  }, [status, navigate, score, timeRemaining, engineRef, submitMatch]);

  const hearts = [];
  for (let i = 0; i < 3; i++) {
    hearts.push(
      <span key={i} style={{ opacity: i < hp ? 1 : 0.3, color: '#ef4444' }}>
        ❤️
      </span>
    );
  }

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return (
    <main ref={mainRef} style={{ width: '100vw', height: '100dvh', position: 'relative', background: '#000', overflow: 'hidden' }}>
      <div 
        role="status"
        aria-live="polite"
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0,
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          color: 'white', 
          fontFamily: 'monospace', 
          fontSize: isTouchDevice ? '0.9rem' : '1.5rem',
          textShadow: '1px 1px 4px black',
          zIndex: 10,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)'
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div>SCORE: {score.toString().padStart(4, '0')}</div>
          <div>TIME: {Math.max(0, Math.ceil(timeRemaining / 1000))}s</div>
        </div>
        <div style={{ display: 'flex', gap: '0.3rem', fontSize: isTouchDevice ? '1.2rem' : '2rem' }}>
          {hearts}
        </div>
      </div>
      
      {(status === 'PAUSED' || status === 'AUTO_PAUSED') && (
        <div 
          role="alert"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
          }}
        >
          <h1 style={{ color: 'white', fontSize: '4rem', letterSpacing: '4px' }}>PAUSED</h1>
        </div>
      )}

      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      </div>

      <MobileControls />

      {!isTouchDevice && (
        <div 
          style={{ 
            position: 'absolute', 
            bottom: 20, 
            width: '100%', 
            textAlign: 'center', 
            color: 'rgba(255,255,255,0.5)', 
            fontFamily: 'monospace',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          W/S (Move) | A/D (Rotate) | Space (Front) | Q/E (Sides) | P (Pause)
        </div>
      )}
    </main>
  );
}
