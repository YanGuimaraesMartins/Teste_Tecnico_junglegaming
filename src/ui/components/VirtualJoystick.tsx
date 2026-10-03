import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';

interface VirtualJoystickProps {
  onMove: (data: { dx: number; dy: number }) => void;
  onEnd: () => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove, onEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<ReturnType<typeof nipplejs.create> | null>(null);
  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);

  onMoveRef.current = onMove;
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!containerRef.current) return;

    const manager = nipplejs.create({
      zone: containerRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'rgba(255, 255, 255, 0.5)',
      size: 120,
      restOpacity: 0.6,
    });

    managerRef.current = manager;

    manager.on('move', (_evt: unknown, data: { angle?: { radian: number }; force?: number }) => {
      if (!data.angle || !data.force) return;
      const force = Math.min(data.force / 2, 1);
      const rad = data.angle.radian;
      const dx = Math.cos(rad) * force;
      const dy = Math.sin(rad) * force;
      onMoveRef.current({ dx, dy });
    });

    manager.on('end', () => {
      onEndRef.current();
    });

    return () => {
      manager.destroy();
      managerRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        width: '140px',
        height: '140px',
        pointerEvents: 'auto',
        touchAction: 'none',
      }}
    />
  );
};
