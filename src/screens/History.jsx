import React, { useState, useEffect } from 'react';
import { getHistory, updateSession } from '../data/sessionStore';
import { formatDate } from '../utils/date';

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
    const refreshed = getHistory();
    setSessions(refreshed);
    const saved = refreshed.find(s => s.id === cleaned.id);
    setSelectedSession(saved || cleaned);
    setIsEditing(false);
    setEditDraft(null);
  };

  if (selectedSession) {
    const displaySession = isEditing ? editDraft : selectedSession;

    return (
      <div className="screen-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
          <h1 className="screen-title" style={{ marginBottom: 0 }}>
            {isEditing ? 'Edit Workout' : 'Workout Details'}
          </h1>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSave} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Save</button>
              <button onClick={handleCancel} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Cancel</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleStartEdit} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Edit</button>
              <button onClick={handleClose} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Back</button>
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '1.5rem', fontWeight: 'bold' }}>{displaySession.name}</h2>

          <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div><span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Date:</span> {formatDate(displaySession.date)}</div>
            <div><span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Duration:</span> {displaySession.durationMinutes} minutes</div>
            {displaySession.notes && <div><span style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Notes:</span> {displaySession.notes}</div>}
          </div>

          <h3 style={{ marginBottom: '16px', borderBottom: '2px solid var(--border-soft)', paddingBottom: '8px', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Exercises Logged
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {displaySession.sessionExercises.map((ex, exIndex) => (
              <div key={ex.id}>
                <h4 style={{ color: 'var(--text-main)', marginBottom: '12px', fontSize: '1.2rem', fontWeight: 'bold' }}>{ex.exerciseName}</h4>

                {isEditing && (
                  <div style={{ display: 'flex', marginBottom: '8px', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', paddingLeft: '4px', fontWeight: 'bold' }}>
                    <div style={{ width: '50px' }}>Set</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>Lbs</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>Reps</div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '4px' }}>
                  {ex.sets.map((set, setIndex) => (
                    <div
                      key={set.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'var(--text-main)',
                        fontSize: '1rem',
                        backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-soft)',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        gap: '8px'
                      }}
                    >
                      <span style={{ color: 'var(--text-main)', width: '50px', fontWeight: 'bold', flexShrink: 0 }}>
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
                            style={{ flex: 1, textAlign: 'center', padding: '6px 8px', fontSize: '1rem' }}
                          />
                          <input
                            className="input-base"
                            type="number"
                            inputMode="numeric"
                            value={set.reps}
                            onChange={e => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
                            style={{ flex: 1, textAlign: 'center', padding: '6px 8px', fontSize: '1rem' }}
                          />
                          <button
                            onClick={() => handleDeleteSet(exIndex, setIndex)}
                            className="btn-danger"
                            style={{ padding: '6px', fontSize: '1rem', flexShrink: 0, borderRadius: '8px' }}
                            title="Delete set"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: 'var(--text-main)' }}>
                            {set.weight} <small style={{ color: 'var(--text-main)', fontWeight: 'normal' }}>lbs</small>
                          </span>
                          <span style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', color: 'var(--text-main)' }}>
                            {set.reps} <small style={{ color: 'var(--text-main)', fontWeight: 'normal' }}>reps</small>
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      onClick={() => handleAddSet(exIndex)}
                      className="btn-ghost"
                      style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--primary)', padding: '4px 8px', alignSelf: 'flex-start', fontWeight: 'bold' }}
                    >
                      + Add Set
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button onClick={handleSave} className="btn-secondary" style={{ flex: 1 }}>Save Changes</button>
              <button onClick={handleCancel} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Workout History</h1>
      </div>

      {sessions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-main)', backgroundColor: 'var(--bg-card)', borderRadius: '18px', border: '1px dashed var(--border-soft)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-main)', fontWeight: 'bold' }}>No workouts completed yet.</p>
          <p style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Go to the Workout tab to log your first session!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sessions.map(session => (
            <div
              key={session.id}
              className="card"
              onClick={() => setSelectedSession(session)}
              style={{ cursor: 'pointer', margin: 0, borderLeft: '4px solid var(--primary)', transition: 'background-color 0.2s', padding: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="section-title" style={{ marginBottom: '6px', color: 'var(--text-main)', fontWeight: 'bold' }}>{session.name}</h3>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: '500' }}>
                    {formatDate(session.date)} • {session.durationMinutes} min
                  </p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-soft)', padding: '10px', borderRadius: '12px', textAlign: 'center', minWidth: '70px' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{session.sessionExercises.length}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px', fontWeight: 'bold' }}>Exercises</div>
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
