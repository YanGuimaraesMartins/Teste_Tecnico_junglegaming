import { useEffect, useRef, useState } from 'react';
import { Application } from 'pixi.js';
import { GameEngine } from '../engine/GameEngine';
import type { MatchStatus } from '../config';

export function usePixiApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [status, setStatus] = useState<MatchStatus>('READY');
  const [hp, setHp] = useState(3);
  const engineRef = useRef<GameEngine | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;
    let isInitDone = false;
    const app = new Application();

    const GAME_WIDTH = 800;
    const GAME_HEIGHT = 600;

    const init = async () => {
      await app.init({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
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
        
        const resizeCanvas = () => {
          const parent = containerRef.current;
          if (!parent || !app.canvas) return;
          const w = parent.clientWidth || window.innerWidth;
          const h = parent.clientHeight || window.innerHeight;
          const scale = Math.min(w / GAME_WIDTH, h / GAME_HEIGHT);
          const scaledW = Math.floor(GAME_WIDTH * scale);
          const scaledH = Math.floor(GAME_HEIGHT * scale);
          app.canvas.style.width = scaledW + 'px';
          app.canvas.style.height = scaledH + 'px';
          app.canvas.style.position = 'absolute';
          app.canvas.style.left = Math.floor((w - scaledW) / 2) + 'px';
          app.canvas.style.top = Math.floor((h - scaledH) / 2) + 'px';
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        (app as unknown as Record<string, unknown>)._resizeCleanup = () => window.removeEventListener('resize', resizeCanvas);
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
        const cleanup = (app as unknown as Record<string, unknown>)._resizeCleanup;
        if (typeof cleanup === 'function') cleanup();
        if (app.canvas.parentNode) {
          app.canvas.parentNode.removeChild(app.canvas);
        }
        app.destroy(true, { children: true });
      }
    };
  }, []);

  return { containerRef, score, timeRemaining, status, hp, engineRef };
}
