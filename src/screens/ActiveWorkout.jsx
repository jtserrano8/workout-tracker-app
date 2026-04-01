import React, { useState, useEffect } from 'react';
import { getTemplates } from '../data/templateStore';
import { getExercises } from '../data/exerciseStore';
import { saveSession, getPreviousWorkoutString, getPreviousWorkoutSets } from '../data/sessionStore';
import { generateId } from '../utils/ids';
import { isValidNumber } from '../utils/validation';

// --- SUB-COMPONENT: Start Menu ---
function WorkoutStartMenu({ templates, startWorkout, startEmptyWorkout }) {
  return (
    <div className="screen-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Start Workout</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card" style={{ border: '2px dashed var(--primary)', cursor: 'pointer', margin: 0, padding: '1.5rem', textAlign: 'center', boxShadow: 'none', backgroundColor: 'transparent' }} onClick={startEmptyWorkout}>
          <h3 style={{ color: 'var(--primary)', fontWeight: 'bold' }}>+ Start Empty Workout</h3>
        </div>
        
        <h3 className="section-title" style={{ marginTop: '0.5rem', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 'bold' }}>From Template</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {templates.map(tpl => (
            <div key={tpl.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: 'var(--text-main)', fontWeight: 'bold' }}>{tpl.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{tpl.exercises?.length || 0} Exercises</p>
              </div>
              <button onClick={() => startWorkout(tpl)} className="btn-primary" style={{ padding: '8px 16px' }}>Start</button>
            </div>
          ))}
          {templates.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', borderRadius: '18px', border: '1px dashed var(--border-soft)' }}>
              <p style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '0.5rem' }}>No templates available.</p>
              <p style={{ fontSize: '0.9rem' }}>Create one in the Templates tab!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Live Runner ---
function WorkoutRunner({ 
  activeSession, 
  warningMsg, 
  updateSet, 
  addSet, 
  duplicateLastSet, 
  finishWorkout, 
  cancelWorkout 
}) {
  return (
    <div className="screen-container" style={{ paddingBottom: '90px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
        <h1 className="screen-title" style={{ marginBottom: 0, fontSize: '1.75rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {activeSession.name}
        </h1>
        <div style={{ 
          color: 'var(--bg-card)', 
          fontWeight: 'bold', 
          fontSize: '0.75rem', 
          letterSpacing: '0.5px',
          backgroundColor: 'var(--primary)', 
          padding: '6px 12px', 
          borderRadius: '20px',
          marginLeft: '16px',
          alignSelf: 'center',
          flexShrink: 0
        }}>
          ACTIVE
        </div>
      </div>

      {warningMsg && (
        <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--error)' }}>
          <p style={{ color: 'var(--error)', fontWeight: '600', margin: 0, fontSize: '0.95rem' }}>{warningMsg}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activeSession.sessionExercises.map((ex, exIndex) => (
          <div key={ex.id} className="card" style={{ margin: 0 }}>
            <h3 style={{ marginBottom: ex.previousString ? '6px' : '16px', color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {ex.exerciseName}
            </h3>
            {ex.previousString && (
              <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.85rem', 
                marginBottom: '16px', 
                fontWeight: '600',
                backgroundColor: 'var(--bg-main)',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'inline-block',
                border: '1px solid var(--border-soft)'
              }}>
                {`↻ Last: ${ex.previousString.replace(/^Last time:\s*/i, '').replace(/^↻ Last:\s*/, '').trim()}`}
              </p>
            )}
            
            <div style={{ display: 'flex', marginBottom: '12px', fontWeight: 'bold', color: 'var(--text-main)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <div style={{ width: '40px', textAlign: 'center' }}>Set</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Lbs</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Reps</div>
            </div>

            {ex.sets.map((set, setIndex) => {
              const isSetValid = isValidNumber(set.weight) && isValidNumber(set.reps);
              const rowBorder = isSetValid ? '1px solid var(--secondary)' : `1px solid var(--border-soft)`;
              const rowBg = isSetValid ? 'rgba(232, 168, 124, 0.1)' : 'transparent';
              
              return (
                <div key={set.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '12px', 
                  border: rowBorder, 
                  backgroundColor: rowBg,
                  padding: '8px', 
                  borderRadius: '12px', 
                  transition: 'all 0.2s ease' 
                }}>
                  <div style={{ width: '40px', fontWeight: 'bold', color: 'var(--text-main)', textAlign: 'center', fontSize: '1rem' }}>
                    {setIndex + 1}
                  </div>
                  
                  <div style={{ flex: 1, padding: '0 8px' }}>
                    <input 
                      type="number" 
                      inputMode="decimal"
                      className="input-base"
                      value={set.weight}
                      onChange={e => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                      placeholder={ex.previousSets?.[setIndex]?.weight || '--'}
                      style={{ textAlign: 'center', fontWeight: '600' }} 
                    />
                  </div>
                  
                  <div style={{ flex: 1, padding: '0 8px' }}>
                    <input 
                      type="number" 
                      inputMode="numeric"
                      className="input-base"
                      value={set.reps}
                      onChange={e => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                      placeholder={ex.previousSets?.[setIndex]?.reps || '--'}
                      style={{ textAlign: 'center', fontWeight: '600' }} 
                    />
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button 
                onClick={() => duplicateLastSet(exIndex)} 
                className="btn-outline"
                style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)' }}
              >
                + Duplicate Last
              </button>
              <button 
                onClick={() => addSet(exIndex)} 
                className="btn-outline"
                style={{ flex: 1, padding: '10px 16px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--primary)' }}
              >
                + Empty Set
              </button>
            </div>
          </div>
        ))}

        {activeSession.sessionExercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 32px', backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: '1px dashed var(--border-soft)' }}>
            <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 'bold' }}>No exercises yet.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '8px' }}>Add some to your template first.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px', marginBottom: '32px' }}>
        <button 
          onClick={finishWorkout} 
          className="btn-primary"
          style={{ width: '100%' }}
        >
          Finish Workout
        </button>
        <button 
          onClick={cancelWorkout} 
          className="btn-outline"
          style={{ width: '100%', color: 'var(--error)', borderColor: 'var(--error)' }}
        >
          Cancel Workout
        </button>
      </div>
    </div>
  );
}


// --- MAIN CONTROLLER COMPONENT ---
function ActiveWorkout({ activeSession, setActiveSession, pendingTemplate, setPendingTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  
  const [warningMsg, setWarningMsg] = useState('');

  useEffect(() => {
    setTemplates(getTemplates());
    setAvailableExercises(getExercises());
  }, []);

  useEffect(() => {
    if (pendingTemplate && availableExercises.length > 0) {
      startWorkout(pendingTemplate);
      setPendingTemplate(null);
    }
  }, [pendingTemplate, availableExercises]);

  const startWorkout = (template) => {
    const sessionExercises = (template.exercises || []).map(exId => {
      const ex = availableExercises.find(e => e.id === exId);
      return {
        id: generateId(),
        exerciseId: exId,
        exerciseName: ex ? ex.name : 'Unknown Exercise',
        previousString: getPreviousWorkoutString(exId),
        previousSets: getPreviousWorkoutSets(exId),
        sets: [{ id: generateId(), weight: '', reps: '' }]
      };
    });

    setActiveSession({
      id: generateId(),
      templateId: template.id,
      name: template.name,
      startTime: Date.now(),
      sessionExercises: sessionExercises
    });
    setWarningMsg('');
  };

  const startEmptyWorkout = () => {
    setActiveSession({
      id: generateId(),
      templateId: null,
      name: 'Empty Workout',
      startTime: Date.now(),
      sessionExercises: []
    });
    setWarningMsg('');
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updated = { ...activeSession };
    updated.sessionExercises[exerciseIndex].sets[setIndex][field] = value;
    setActiveSession(updated);
  };

  const addSet = (exerciseIndex) => {
    const updated = { ...activeSession };
    updated.sessionExercises[exerciseIndex].sets.push({
      id: generateId(), weight: '', reps: ''
    });
    setActiveSession(updated);
  };

  const duplicateLastSet = (exerciseIndex) => {
    const updated = { ...activeSession };
    const sets = updated.sessionExercises[exerciseIndex].sets;
    if (sets.length === 0) return;
    const lastSet = sets[sets.length - 1];
    sets.push({
      id: generateId(),
      weight: lastSet.weight,
      reps: lastSet.reps
    });
    setActiveSession(updated);
  };

  const finishWorkout = () => {
    const cleanedExercises = activeSession.sessionExercises.map(ex => ({
      ...ex,
      sets: ex.sets.filter(s => isValidNumber(s.weight) && isValidNumber(s.reps))
    })).filter(ex => ex.sets.length > 0);

    if (cleanedExercises.length === 0) {
      setWarningMsg('You have zero completed sets! Enter valid weight and reps for at least one set, or click Cancel to discard.');
      return;
    }

    const durationMinutes = Math.floor((Date.now() - activeSession.startTime) / 60000);
    const finalSession = {
      id: activeSession.id,
      templateId: activeSession.templateId,
      name: activeSession.name,
      date: new Date().toISOString(),
      durationMinutes: durationMinutes,
      sessionExercises: cleanedExercises
    };

    saveSession(finalSession);
    setActiveSession(null);
    setWarningMsg('');
  };

  const cancelWorkout = () => {
    setActiveSession(null);
    setWarningMsg('');
  };

  if (!activeSession) {
    return (
      <WorkoutStartMenu 
        templates={templates} 
        startWorkout={startWorkout} 
        startEmptyWorkout={startEmptyWorkout} 
      />
    );
  }

  return (
    <WorkoutRunner 
      activeSession={activeSession}
      warningMsg={warningMsg}
      updateSet={updateSet}
      addSet={addSet}
      duplicateLastSet={duplicateLastSet}
      finishWorkout={finishWorkout}
      cancelWorkout={cancelWorkout}
    />
  );
}

export default ActiveWorkout;
