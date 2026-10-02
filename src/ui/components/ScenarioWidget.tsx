import { useState } from 'react';
import { SCENARIOS, Scenario, scenarioManager } from '../../mocks/scenarios';

export default function ScenarioWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<Scenario>(scenarioManager.get());
  const [seed, setSeed] = useState(scenarioManager.getSeed().toString());

  // Only render if MSW is active
  if (!import.meta.env.DEV && import.meta.env.VITE_MSW_ENABLED !== 'true') return null;

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Scenario;
    scenarioManager.set(val);
    setCurrent(val);
    window.location.reload(); // Reload to apply new scenario clearly
  };

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.value);
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      scenarioManager.setSeed(parsed);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('mock_db_matches');
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('match_attempts_')) localStorage.removeItem(key);
    });
    window.location.reload();
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999,
          background: '#3b82f6', color: 'white', border: 'none', borderRadius: '50%',
          width: '40px', height: '40px', cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        title="MSW Controls"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999,
      background: '#1e293b', color: 'white', padding: '1rem', borderRadius: '8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', border: '1px solid #334155',
      width: '280px', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '0.5rem' }}>
        <strong>MSW Scenarios</strong>
        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>✕</button>
      </div>

      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        Scenario
        <select 
          value={current} 
          onChange={handleScenarioChange}
          style={{ background: '#0f172a', color: 'white', border: '1px solid #334155', padding: '0.25rem', borderRadius: '4px' }}
        >
          {SCENARIOS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        RNG Seed
        <input 
          type="number" 
          value={seed} 
          onChange={handleSeedChange}
          style={{ background: '#0f172a', color: 'white', border: '1px solid #334155', padding: '0.25rem', borderRadius: '4px' }}
        />
      </label>

      <button 
        onClick={handleReset}
        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', marginTop: '0.5rem' }}
      >
        Reset Database State
      </button>
    </div>
  );
}
