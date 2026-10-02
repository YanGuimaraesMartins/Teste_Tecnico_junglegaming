import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import { GameEngine } from '../engine/GameEngine';
import type { MatchStatus } from '../config';

export function usePixiApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [status, setStatus] = useState<MatchStatus>('READY');
  const [hp, setHp] = useState(3); // Player initial HP
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;
    let isInitDone = false;
    const app = new Application();

    const init = async () => {
      await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0x1e90ff,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      isInitDone = true;

      if (!isMounted) {
        app.destroy(true, { children: true });
        return;
      }

      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas);
        // Stylize the canvas
        app.canvas.style.border = '2px solid #333';
      }

      engineRef.current = new GameEngine(app, setScore, setTimeRemaining, setStatus, setHp);
    };

    void init();

    return () => {
      isMounted = false;
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      if (isInitDone) {
        if (app.canvas.parentNode) {
          app.canvas.parentNode.removeChild(app.canvas);
        }
        app.destroy(true, { children: true });
      }
    };
  }, []);

  return { containerRef, score, timeRemaining, status, hp, engineRef };
}
