import React, { useState, useEffect } from 'react';
import { getHistory } from '../data/sessionStore';
import { formatDate } from '../utils/date';
import ScreenHeader from '../components/layout/ScreenHeader';

function History({ selectedSession, setSelectedSession }) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // getHistory() already returns items with newest first
    setSessions(getHistory());
  }, []);

  const handleClose = () => {
    setSelectedSession(null);
  };

  // RENDER DETAILS VIEW
  if (selectedSession) {
    return (
      <div className="screen-container">
        <ScreenHeader title="Workout Details">
          <button onClick={handleClose} className="btn-ghost" style={{ padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px' }}>Back</button>
        </ScreenHeader>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.5rem' }}>{selectedSession.name}</h2>
          
          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div><span style={{color: 'var(--text-main)'}}>Date:</span> {formatDate(selectedSession.date)}</div>
            <div><span style={{color: 'var(--text-main)'}}>Duration:</span> {selectedSession.durationMinutes} minutes</div>
            {selectedSession.notes && <div><span style={{color: 'var(--text-main)'}}>Notes:</span> {selectedSession.notes}</div>}
          </div>

          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', color: 'white', fontSize: '1.1rem' }}>Exercises Logged</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {selectedSession.sessionExercises.map((ex) => (
              <div key={ex.id}>
                <h4 style={{ color: 'var(--secondary)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>{ex.exerciseName}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.25rem' }}>
                  {ex.sets.map((set, idx) => (
                    <div key={set.id} style={{ display: 'flex', color: 'var(--text-main)', fontSize: '1rem', backgroundColor: '#2a2a2a', padding: '0.6rem 1rem', borderRadius: '4px' }}>
                      <span style={{ color: 'var(--text-muted)', width: '50px', fontWeight: 'bold' }}>Set {idx + 1}</span>
                      <span style={{ flex: 1, textAlign: 'center' }}>{set.weight} <small style={{color:'var(--text-muted)'}}>lbs</small></span>
                      <span style={{ flex: 1, textAlign: 'center' }}>{set.reps} <small style={{color:'var(--text-muted)'}}>reps</small></span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // RENDER LIST VIEW
  return (
    <div className="screen-container">
      <ScreenHeader title="Workout History" />
      
      {sessions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', borderRadius: '8px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No workouts completed yet.</p>
          <p style={{ fontSize: '0.9rem' }}>Go to the Workout tab to log your first session!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sessions.map(session => (
            <div 
              key={session.id} 
              className="card" 
              onClick={() => setSelectedSession(session)}
              style={{ cursor: 'pointer', margin: 0, borderLeft: '4px solid var(--primary)', transition: 'background-color 0.2s', padding: '1.25rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'white' }}>{session.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {formatDate(session.date)} • {session.durationMinutes} min
                  </p>
                </div>
                <div style={{ backgroundColor: '#222', padding: '0.5rem', borderRadius: '6px', textAlign: 'center', minWidth: '70px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{session.sessionExercises.length}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '0.2rem' }}>Exercises</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;
