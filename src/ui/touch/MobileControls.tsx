import { useEffect, useState } from 'react';

export default function MobileControls() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  if (!isTouchDevice) return null;

  // Simulate key presses
  const dispatchKey = (key: string, type: 'keydown' | 'keyup') => {
    window.dispatchEvent(new KeyboardEvent(type, { key }));
  };

  const handleTouchStart = (key: string) => (e: React.TouchEvent) => {
    e.preventDefault();
    dispatchKey(key, 'keydown');
  };

  const handleTouchEnd = (key: string) => (e: React.TouchEvent) => {
    e.preventDefault();
    dispatchKey(key, 'keyup');
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 15,
    }}>
      {/* Portrait Warning Overlay */}
      <div className="portrait-warning" style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: 'white',
        display: 'none',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'auto',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Rotate your device</h2>
        <p>This game requires Landscape orientation.</p>
      </div>

      <style>{`
        @media (orientation: portrait) {
          .portrait-warning { display: flex !important; }
        }
      `}</style>

      {/* D-Pad */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        display: 'grid',
        gridTemplateColumns: '60px 60px 60px',
        gridTemplateRows: '60px 60px 60px',
        gap: '5px',
        pointerEvents: 'auto',
      }}>
        <button 
          style={{ gridColumn: '2', gridRow: '1', ...btnStyle }}
          onTouchStart={handleTouchStart('w')} onTouchEnd={handleTouchEnd('w')}
        >W</button>
        <button 
          style={{ gridColumn: '1', gridRow: '2', ...btnStyle }}
          onTouchStart={handleTouchStart('a')} onTouchEnd={handleTouchEnd('a')}
        >A</button>
        <button 
          style={{ gridColumn: '2', gridRow: '2', ...btnStyle }}
          onTouchStart={handleTouchStart('s')} onTouchEnd={handleTouchEnd('s')}
        >S</button>
        <button 
          style={{ gridColumn: '3', gridRow: '2', ...btnStyle }}
          onTouchStart={handleTouchStart('d')} onTouchEnd={handleTouchEnd('d')}
        >D</button>
      </div>

      {/* Action Buttons */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        pointerEvents: 'auto',
        alignItems: 'center'
      }}>
        <button 
          style={{ ...btnStyle, width: '70px', height: '70px', borderRadius: '35px' }}
          onTouchStart={handleTouchStart('q')} onTouchEnd={handleTouchEnd('q')}
        >Q</button>
        <button 
          style={{ ...btnStyle, width: '80px', height: '80px', borderRadius: '40px', background: 'rgba(239, 68, 68, 0.4)' }}
          onTouchStart={handleTouchStart(' ')} onTouchEnd={handleTouchEnd(' ')}
        >SPACE</button>
        <button 
          style={{ ...btnStyle, width: '70px', height: '70px', borderRadius: '35px' }}
          onTouchStart={handleTouchStart('e')} onTouchEnd={handleTouchEnd('e')}
        >E</button>
      </div>
    </div>
  );
}

const btnStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  border: '2px solid rgba(255, 255, 255, 0.4)',
  borderRadius: '8px',
  color: 'white',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none' as const,
  WebkitUserSelect: 'none' as const,
};
