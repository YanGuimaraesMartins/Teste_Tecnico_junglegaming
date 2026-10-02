import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRanking, useMatchHistory } from '../../api/hooks';

export default function LeaderboardScreen() {
  const [tab, setTab] = useState<'ranking' | 'history'>('ranking');
  const [page, setPage] = useState(1);

  const { data: rankingData, isLoading: loadingRanking, isError: errorRanking } = useRanking(page);
  // Hardcoded 'player-1' for history as per our mock logic
  const { data: historyData, isLoading: loadingHistory, isError: errorHistory } = useMatchHistory('player-1', page);

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%',
      backgroundImage: 'radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)',
    }}>
      <div className="glass-panel" style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        minWidth: '500px',
        animation: 'slideIn 0.3s ease-out',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'white' }}>Rankings & History</h1>
        
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <button 
            className={tab === 'ranking' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => { setTab('ranking'); setPage(1); }}
            style={{ flex: 1, padding: '8px' }}
          >
            Global Ranking
          </button>
          <button 
            className={tab === 'history' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => { setTab('history'); setPage(1); }}
            style={{ flex: 1, padding: '8px' }}
          >
            My History
          </button>
        </div>

        <div style={{ width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '1rem', minHeight: '300px' }}>
          {tab === 'ranking' && (
            <div>
              {loadingRanking && <p>Loading rankings...</p>}
              {errorRanking && <p>Failed to load rankings.</p>}
              {!loadingRanking && !errorRanking && rankingData?.data && rankingData.data.length === 0 && <p>No rankings yet.</p>}
              {!loadingRanking && !errorRanking && rankingData?.data.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span>{(page - 1) * 10 + i + 1}. {p.playerName}</span>
                  <span style={{ fontWeight: 'bold', color: '#60a5fa' }}>{p.score} pts</span>
                </div>
              ))}
            </div>
          )}

          {tab === 'history' && (
            <div>
              {loadingHistory && <p>Loading history...</p>}
              {errorHistory && <p>Failed to load history.</p>}
              {!loadingHistory && !errorHistory && historyData?.data && historyData.data.length === 0 && <p>No history yet.</p>}
              {!loadingHistory && !errorHistory && historyData?.data.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  <span>{m.duration}s ({m.endReason})</span>
                  <span style={{ fontWeight: 'bold', color: '#f87171' }}>{m.score} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            className="btn-secondary" 
            onClick={() => { setPage(p => Math.max(1, p - 1)); }}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button 
            className="btn-secondary" 
            onClick={() => { setPage(p => p + 1); }}
            disabled={tab === 'ranking' ? (page >= Math.ceil((rankingData?.total || 1) / (rankingData?.limit || 10))) : (page >= Math.ceil((historyData?.total || 1) / (historyData?.limit || 10)))}
          >
            Next
          </button>
        </div>

        <Link to="/" className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>
          Back to Menu
        </Link>
      </div>
    </main>
  );
}
