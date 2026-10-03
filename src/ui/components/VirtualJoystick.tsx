import { useEffect, useRef } from 'react';

interface VirtualJoystickProps {
  onMove: (data: { dx: number; dy: number }) => void;
  onEnd: () => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove, onEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);
  const activeRef = useRef(false);
  const touchIdRef = useRef<number | null>(null);

  onMoveRef.current = onMove;
  onEndRef.current = onEnd;

  useEffect(() => {
    const container = containerRef.current;
    const knob = knobRef.current;
    if (!container || !knob) return;

    const RADIUS = 50; // max distance knob can travel

    const getCenter = () => {
      const rect = container.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };

    const handleStart = (e: TouchEvent) => {
      if (activeRef.current) return;
      const touch = e.changedTouches[0];
      if (!touch) return;
      e.preventDefault();
      activeRef.current = true;
      touchIdRef.current = touch.identifier;
      handleMove(e);
    };

    const handleMove = (e: TouchEvent) => {
      if (!activeRef.current) return;
      let touch: Touch | undefined;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touch = e.changedTouches[i];
          break;
        }
      }
      if (!touch) return;
      e.preventDefault();

      const center = getCenter();
      let rawDx = touch.clientX - center.x;
      let rawDy = touch.clientY - center.y;
      const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);

      // Clamp to radius
      if (dist > RADIUS) {
        rawDx = (rawDx / dist) * RADIUS;
        rawDy = (rawDy / dist) * RADIUS;
      }

      // Move the knob visually
      knob.style.transform = `translate(${rawDx}px, ${rawDy}px)`;

      // Normalize to -1..1
      const dx = rawDx / RADIUS;
      const dy = -rawDy / RADIUS; // invert Y: up on screen = positive dy (forward)
      onMoveRef.current({ dx, dy });
    };

    const handleEnd = (e: TouchEvent) => {
      if (!activeRef.current) return;
      let found = false;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          found = true;
          break;
        }
      }
      if (!found) return;
      e.preventDefault();
      activeRef.current = false;
      touchIdRef.current = null;
      knob.style.transform = 'translate(0px, 0px)';
      onEndRef.current();
    };

    container.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd, { passive: false });
    window.addEventListener('touchcancel', handleEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        bottom: '15px',
        left: '15px',
        width: '130px',
        height: '130px',
        pointerEvents: 'auto',
        touchAction: 'none',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={knobRef}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.4)',
          border: '2px solid rgba(255, 255, 255, 0.6)',
          transition: 'none',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
