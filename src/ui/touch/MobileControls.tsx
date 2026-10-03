import { useEffect, useState, useCallback, useRef } from 'react';
import { VirtualJoystick } from '../components/VirtualJoystick';

export default function MobileControls() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const activeKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setIsTouchDevice(
      'ontouchstart' in window || 
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0
    );
  }, []);

  const pressKey = useCallback((key: string) => {
    if (!activeKeysRef.current.has(key)) {
      activeKeysRef.current.add(key);
      window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    }
  }, []);

  const releaseKey = useCallback((key: string) => {
    if (activeKeysRef.current.has(key)) {
      activeKeysRef.current.delete(key);
      window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
    }
  }, []);

  const handleJoystickMove = useCallback((data: { dx: number; dy: number }) => {
    if (data.dy > 0.3) { pressKey('w'); releaseKey('s'); }
    else if (data.dy < -0.3) { pressKey('s'); releaseKey('w'); }
    else { releaseKey('w'); releaseKey('s'); }

    if (data.dx > 0.3) { pressKey('d'); releaseKey('a'); }
    else if (data.dx < -0.3) { pressKey('a'); releaseKey('d'); }
    else { releaseKey('a'); releaseKey('d'); }
  }, [pressKey, releaseKey]);

  const handleJoystickEnd = useCallback(() => {
    releaseKey('w');
    releaseKey('s');
    releaseKey('a');
    releaseKey('d');
  }, [releaseKey]);

  const handleTouchStart = (key: string) => (e: React.TouchEvent) => {
    e.preventDefault();
    pressKey(key);
  };

  const handleTouchEnd = (key: string) => (e: React.TouchEvent) => {
    e.preventDefault();
    releaseKey(key);
  };

  if (!isTouchDevice) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 15,
    }}>
      <div className="portrait-warning" style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        color: 'white',
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'auto',
      }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>Deite o celular</h2>
        <p style={{ fontSize: '1.1rem', color: '#9ca3af' }}>Este jogo requer orientacao Landscape.</p>
      </div>

      <style>{`
        @media (orientation: portrait) {
          .portrait-warning { display: flex !important; }
        }
      `}</style>

      <VirtualJoystick 
        onMove={handleJoystickMove}
        onEnd={handleJoystickEnd}
      />
      
      <div style={{
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        display: 'flex',
        gap: '12px',
        pointerEvents: 'auto',
        alignItems: 'flex-end',
        touchAction: 'none',
      }}>
        <button 
          style={{ ...btnStyle, width: '60px', height: '60px', borderRadius: '30px', fontSize: '0.9rem' }}
          onTouchStart={handleTouchStart('q')} onTouchEnd={handleTouchEnd('q')}
        >LEFT</button>
        <button 
          style={{ ...btnStyle, width: '75px', height: '75px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.5)', border: '2px solid rgba(239, 68, 68, 0.7)', fontSize: '0.8rem' }}
          onTouchStart={handleTouchStart(' ')} onTouchEnd={handleTouchEnd(' ')}
        >FIRE</button>
        <button 
          style={{ ...btnStyle, width: '60px', height: '60px', borderRadius: '30px', fontSize: '0.9rem' }}
          onTouchStart={handleTouchStart('e')} onTouchEnd={handleTouchEnd('e')}
        >RIGHT</button>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.15)',
  border: '2px solid rgba(255, 255, 255, 0.35)',
  borderRadius: '8px',
  color: 'white',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'none',
};
