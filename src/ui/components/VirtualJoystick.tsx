import React, { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';

interface VirtualJoystickProps {
  onMove: (data: { dx: number; dy: number }) => void;
  onEnd: () => void;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove, onEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const managerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    managerRef.current = nipplejs.create({
      zone: containerRef.current,
      mode: 'static',
      position: { left: '50%', bottom: '50%' },
      color: 'white',
      size: 100,
    });

    managerRef.current.on('move', (_: any, data: any) => {
      // Normalize dx and dy to -1 to 1 based on force/angle
      const dx = Math.cos(data.angle.radian) * Math.min(data.force, 1);
      const dy = -Math.sin(data.angle.radian) * Math.min(data.force, 1);
      onMove({ dx, dy });
    });

    managerRef.current.on('end', () => {
      onEnd();
    });

    return () => {
      managerRef.current?.destroy();
    };
  }, [onMove, onEnd]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        bottom: '80px',
        left: '80px',
        width: '100px',
        height: '100px',
        pointerEvents: 'auto',
      }}
    />
  );
};
