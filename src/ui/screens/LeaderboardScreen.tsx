import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRanking, useMatchHistory } from '../../api/hooks';

export default function LeaderboardScreen() {
  const [tab, setTab] = useState<'ranking' | 'history'>('ranking');
  const [page, setPage] = useState(1);

  const { data: rankingData, isLoading: loadingRanking, isError: errorRanking } = useRanking(page);
  const { data: historyData, isLoading: loadingHistory, isError: errorHistory } = useMatchHistory('player-1', page);

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100dvh',
      padding: '12px',
      backgroundImage: 'radial-gradient(circle at center, #1e3a8a 0%, #0f172a 100%)',
      overflow: 'hidden',
    }}>
      <div className="glass-panel" style={{
        padding: '1.2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        width: '100%',
        maxWidth: '550px',
        animation: 'slideIn 0.3s ease-out',
        maxHeight: '95dvh',
        overflow: 'hidden',
      }}>
        <h1 style={{ margin: 0, fontSize: 'clamp(1.2rem, 4vw, 2rem)', color: 'white', textAlign: 'center' }}>Rankings & History</h1>
        
        <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
          <button 
            className={tab === 'ranking' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => { setTab('ranking'); setPage(1); }}
            style={{ flex: 1, padding: '8px', fontSize: 'clamp(0.7rem, 2.5vw, 1rem)' }}
          >
            Global Ranking
          </button>
          <button 
            className={tab === 'history' ? 'btn-primary' : 'btn-secondary'} 
            onClick={() => { setTab('history'); setPage(1); }}
            style={{ flex: 1, padding: '8px', fontSize: 'clamp(0.7rem, 2.5vw, 1rem)' }}
          >
            My History
          </button>
        </div>

        <div style={{ 
          width: '100%', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '8px', 
          padding: '0.8rem', 
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          fontSize: 'clamp(0.75rem, 2.5vw, 1rem)',
        }}>
          {tab === 'ranking' && (
            <div>
              {loadingRanking && <p>Loading rankings...</p>}
              {errorRanking && <p>Failed to load rankings.</p>}
              {!loadingRanking && !errorRanking && rankingData?.data && rankingData.data.length === 0 && <p>No rankings yet.</p>}
              {!loadingRanking && !errorRanking && (rankingData?.data || []).map((p, i) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span>{(page - 1) * 5 + i + 1}. {p.playerName}</span>
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
              {!loadingHistory && !errorHistory && (historyData?.data || []).map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  <span>{m.duration}s ({m.endReason})</span>
                  <span style={{ fontWeight: 'bold', color: '#f87171' }}>{m.score} pts</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', width: '100%', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <button 
            className="btn-secondary" 
            onClick={() => { setPage(p => Math.max(1, p - 1)); }}
            disabled={page === 1}
            style={{ padding: '8px 16px', fontSize: 'clamp(0.7rem, 2.5vw, 1rem)' }}
          >
            Prev
          </button>
          <span style={{ fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>Page {page}</span>
          <button 
            className="btn-secondary" 
            onClick={() => { setPage(p => p + 1); }}
            disabled={tab === 'ranking' ? (page >= Math.ceil((rankingData?.total || 1) / (rankingData?.limit || 5))) : (page >= Math.ceil((historyData?.total || 1) / (historyData?.limit || 5)))}
            style={{ padding: '8px 16px', fontSize: 'clamp(0.7rem, 2.5vw, 1rem)' }}
          >
            Next
          </button>
        </div>

        <Link to="/" className="btn-secondary" style={{ width: '100%', flexShrink: 0, fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>
          Back to Menu
        </Link>
      </div>
    </main>
  );
}
