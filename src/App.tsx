import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MenuScreen from './ui/screens/MenuScreen';
import OptionsScreen from './ui/screens/OptionsScreen';
import GameScreen from './ui/screens/GameScreen';
import ResultScreen from './ui/screens/ResultScreen';
import LeaderboardScreen from './ui/screens/LeaderboardScreen';
import LoadingScreen from './ui/screens/LoadingScreen';
import { useResumePendingMatch } from './api/hooks';
import ScenarioWidget from './ui/components/ScenarioWidget';

function useAutoFullscreen() {
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return;

    const requestFS = () => {
      const el = document.documentElement;
      try {
        if (!document.fullscreenElement) {
          if (el.requestFullscreen) {
            el.requestFullscreen().catch(() => {});
          } else if ((el as any).webkitRequestFullscreen) {
            (el as any).webkitRequestFullscreen();
          }
        }
      } catch (_) { /* ignore */ }

      try {
        if ((screen.orientation as any)?.lock) {
          (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } catch (_) { /* ignore */ }
    };

    // Request on any touch interaction
    const handler = () => {
      requestFS();
    };

    document.addEventListener('touchstart', handler);
    return () => document.removeEventListener('touchstart', handler);
  }, []);
}

export default function App() {
  useResumePendingMatch();
  useAutoFullscreen();

  return (
    <>
      <Routes>
        <Route path="/" element={<MenuScreen />} />
        <Route path="/options" element={<OptionsScreen />} />
        <Route path="/loading" element={<LoadingScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ScenarioWidget />
    </>
  )
}
