import React, { useState, useEffect } from 'react';
import { getHistory, updateSession } from '../data/sessionStore';
import { formatDate } from '../utils/date';
import ScreenHeader from '../components/layout/ScreenHeader';

function History({ selectedSession, setSelectedSession }) {
  const [sessions, setSessions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);

  useEffect(() => {
    setSessions(getHistory());
  }, []);

  const handleClose = () => {
    setIsEditing(false);
    setEditDraft(null);
    setSelectedSession(null);
  };

  const handleStartEdit = () => {
    // Deep-copy the session so edits don't mutate the original object in memory
    setEditDraft(JSON.parse(JSON.stringify(selectedSession)));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditDraft(null);
    setIsEditing(false);
  };

  const handleSetChange = (exIndex, setIndex, field, value) => {
    setEditDraft(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.sessionExercises[exIndex].sets[setIndex][field] = value;
      return updated;
    });
  };

  const handleDeleteSet = (exIndex, setIndex) => {
    setEditDraft(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.sessionExercises[exIndex].sets.splice(setIndex, 1);
      return updated;
    });
  };

  const handleAddSet = (exIndex) => {
    setEditDraft(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated.sessionExercises[exIndex].sets.push({ id: Date.now(), weight: '', reps: '' });
      return updated;
    });
  };

  const handleSave = () => {
    const cleaned = JSON.parse(JSON.stringify(editDraft));
    cleaned.sessionExercises = cleaned.sessionExercises.map(ex => ({
      ...ex,
      sets: ex.sets.filter(s => s.weight !== '' && s.reps !== '')
    }));
    updateSession(cleaned);
    // Refresh the list so the updated data shows if user goes back
    const refreshed = getHistory();
    setSessions(refreshed);
    // Replace the selectedSession with the saved draft
    const saved = refreshed.find(s => s.id === cleaned.id);
    setSelectedSession(saved || cleaned);
    setIsEditing(false);
    setEditDraft(null);
  };

  // RENDER DETAILS VIEW
  if (selectedSession) {
    const displaySession = isEditing ? editDraft : selectedSession;

    return (
      <div className="screen-container">
        <ScreenHeader title={isEditing ? 'Edit Workout' : 'Workout Details'}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleSave}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', borderRadius: '4px', border: 'none' }}
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="btn-outline"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', borderRadius: '4px' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleStartEdit}
                className="btn-ghost"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', borderRadius: '4px', border: 'none' }}
              >
                Edit
              </button>
              <button
                onClick={handleClose}
                className="btn-ghost"
                style={{ padding: '0.4rem 0.8rem', border: 'none', borderRadius: '4px' }}
              >
                Back
              </button>
            </div>
          )}
        </ScreenHeader>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.5rem' }}>{displaySession.name}</h2>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div><span style={{ color: 'var(--text-main)' }}>Date:</span> {formatDate(displaySession.date)}</div>
            <div><span style={{ color: 'var(--text-main)' }}>Duration:</span> {displaySession.durationMinutes} minutes</div>
            {displaySession.notes && <div><span style={{ color: 'var(--text-main)' }}>Notes:</span> {displaySession.notes}</div>}
          </div>

          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', color: 'white', fontSize: '1.1rem' }}>Exercises Logged</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {displaySession.sessionExercises.map((ex, exIndex) => (
              <div key={ex.id}>
                <h4 style={{ color: 'var(--secondary)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>{ex.exerciseName}</h4>

                {/* Column headers — only show in edit mode */}
                {isEditing && (
                  <div style={{ display: 'flex', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '0.25rem' }}>
                    <div style={{ width: '50px' }}>Set</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>Lbs</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>Reps</div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.25rem' }}>
                  {ex.sets.map((set, setIndex) => (
                    <div
                      key={set.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--text-main)',
                        fontSize: '1rem',
                        backgroundColor: '#2a2a2a',
                        padding: '0.6rem 1rem',
                        borderRadius: '4px',
                        gap: '0.5rem'
                      }}
                    >
                      <span style={{ color: 'var(--text-muted)', width: '50px', fontWeight: 'bold', flexShrink: 0 }}>
                        Set {setIndex + 1}
                      </span>

                      {isEditing ? (
                        <>
                          <input
                            className="input-base"
                            type="number"
                            inputMode="decimal"
                            value={set.weight}
                            onChange={e => handleSetChange(exIndex, setIndex, 'weight', e.target.value)}
                            style={{ flex: 1, textAlign: 'center', padding: '0.4rem 0.5rem', fontSize: '1rem' }}
                          />
                          <input
                            className="input-base"
                            type="number"
                            inputMode="numeric"
                            value={set.reps}
                            onChange={e => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
                            style={{ flex: 1, textAlign: 'center', padding: '0.4rem 0.5rem', fontSize: '1rem' }}
                          />
                          <button
                            onClick={() => handleDeleteSet(exIndex, setIndex)}
                            className="btn-ghost"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '1rem', border: 'none', color: 'var(--text-muted)', flexShrink: 0 }}
                            title="Delete set"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={{ flex: 1, textAlign: 'center' }}>
                            {set.weight} <small style={{ color: 'var(--text-muted)' }}>lbs</small>
                          </span>
                          <span style={{ flex: 1, textAlign: 'center' }}>
                            {set.reps} <small style={{ color: 'var(--text-muted)' }}>reps</small>
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => handleAddSet(exIndex)}
                      className="btn-ghost"
                      style={{ marginTop: '0.25rem', fontSize: '0.85rem', border: 'none', color: 'var(--secondary)', padding: '0.3rem 0.5rem', alignSelf: 'flex-start' }}
                    >
                      + Add Set
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom action bar — only in edit mode for easy access on long workouts */}
          {isEditing && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
              <button
                onClick={handleSave}
                className="btn-secondary"
                style={{ flex: 1, borderRadius: '6px', border: 'none' }}
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="btn-outline"
                style={{ flex: 1, borderRadius: '6px' }}
              >
                Cancel
              </button>
            </div>
          )}
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
