import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function OptionsScreen() {
  const [volume, setVolume] = useState(100);
  const [spawnInterval, setSpawnInterval] = useState(3000);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedVolume = localStorage.getItem('pb_volume');
    const savedSpawn = localStorage.getItem('pb_spawnInterval');
    if (savedVolume) setVolume(Number(savedVolume));
    if (savedSpawn) setSpawnInterval(Number(savedSpawn));
  }, []);

  const handleSave = () => {
    localStorage.setItem('pb_volume', volume.toString());
    localStorage.setItem('pb_spawnInterval', spawnInterval.toString());
    setSaved(true);
    setTimeout(() => { setSaved(false); }, 2000);
  };

  return (
    <main style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%',
      backgroundImage: 'radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)',
    }}>
      <div className="glass-panel" style={{
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        minWidth: '400px',
        animation: 'slideIn 0.3s ease-out'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'white' }}>Options</h1>
        
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label htmlFor="volume-slider">Master Volume</label>
              <span>{volume}%</span>
            </div>
            <input 
              id="volume-slider"
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={(e) => { setVolume(Number(e.target.value)); }}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label htmlFor="spawn-slider">Enemy Spawn Interval</label>
              <span>{(spawnInterval / 1000).toFixed(1)}s</span>
            </div>
            <input 
              id="spawn-slider"
              type="range" 
              min="500" 
              max="5000" 
              step="500"
              value={spawnInterval} 
              onChange={(e) => { setSpawnInterval(Number(e.target.value)); }}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%', marginTop: '1rem' }}>
          <Link to="/" className="btn-secondary" style={{ flex: 1 }}>
            Back
          </Link>
          <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}>
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
    </main>
  );
}
