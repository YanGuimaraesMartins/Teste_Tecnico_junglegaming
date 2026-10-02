import { Routes, Route, Navigate } from 'react-router-dom';
import MenuScreen from './ui/screens/MenuScreen';
import OptionsScreen from './ui/screens/OptionsScreen';
import GameScreen from './ui/screens/GameScreen';
import ResultScreen from './ui/screens/ResultScreen';
import LeaderboardScreen from './ui/screens/LeaderboardScreen';
import LoadingScreen from './ui/screens/LoadingScreen';
import { useResumePendingMatch } from './api/hooks';
import ScenarioWidget from './ui/components/ScenarioWidget';

export default function App() {
  useResumePendingMatch();

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
