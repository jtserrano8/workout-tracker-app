import React, { useState, useEffect } from 'react';
import { getTemplates } from '../data/templateStore';
import { getExercises } from '../data/exerciseStore';
import { saveSession, getPreviousWorkoutString } from '../data/sessionStore';
import { generateId } from '../utils/ids';
import { isValidNumber } from '../utils/validation';
import ScreenHeader from '../components/layout/ScreenHeader';

// --- SUB-COMPONENT: Start Menu ---
function WorkoutStartMenu({ templates, startWorkout, startEmptyWorkout }) {
  return (
    <div className="screen-container">
      <ScreenHeader title="Start Workout" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card" style={{ border: '2px dashed var(--primary)', cursor: 'pointer', margin: 0, padding: '1.5rem' }} onClick={startEmptyWorkout}>
          <h3 style={{ textAlign: 'center', color: 'var(--primary)' }}>+ Start Empty Workout</h3>
        </div>
        
        <h3 style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>From Template</h3>
        {templates.map(tpl => (
          <div key={tpl.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{tpl.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{tpl.exercises?.length || 0} Exercises</p>
            </div>
            <button onClick={() => startWorkout(tpl)} className="btn-primary" style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>Start</button>
          </div>
        ))}
        {templates.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>No templates available. Create one in the Templates tab!</p>
        )}
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
    <div className="screen-container">
      <ScreenHeader title={activeSession.name}>
        <div style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '0.9rem', backgroundColor: '#1a3329', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
          Active
        </div>
      </ScreenHeader>

      {warningMsg && (
        <div style={{ backgroundColor: 'rgba(207, 102, 121, 0.2)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid var(--error)' }}>
          <p style={{ color: 'var(--error)', fontWeight: 'bold' }}>{warningMsg}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {activeSession.sessionExercises.map((ex, exIndex) => (
          <div key={ex.id} className="card" style={{ margin: 0, padding: '1.25rem' }}>
            <h3 style={{ marginBottom: ex.previousString ? '0.25rem' : '1.25rem', color: 'var(--secondary)', fontSize: '1.2rem' }}>{ex.exerciseName}</h3>
            {ex.previousString && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', fontStyle: 'italic' }}>
                {ex.previousString}
              </p>
            )}
            
            <div style={{ display: 'flex', marginBottom: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <div style={{ width: '30px', paddingLeft: '0.25rem' }}>Set</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Lbs</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Reps</div>
            </div>

            {ex.sets.map((set, setIndex) => {
              // Automatic validation: visually indicate if the set is successfully filled
              const isSetValid = isValidNumber(set.weight) && isValidNumber(set.reps);
              const rowBorder = isSetValid ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid transparent';
              const inputBg = isSetValid ? '#1a241b' : '#121212';
              
              return (
                <div key={set.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', border: rowBorder, padding: '0.25rem', borderRadius: '6px', transition: 'all 0.2s' }}>
                  <div style={{ width: '30px', fontWeight: 'bold', color: 'var(--text-muted)', paddingLeft: '0.25rem' }}>{setIndex + 1}</div>
                  
                  <div style={{ flex: 1, padding: '0 0.5rem' }}>
                    <input 
                      type="number" 
                      value={set.weight}
                      onChange={e => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                      placeholder="--"
                      className="input-base"
                      style={{ padding: '0.6rem', textAlign: 'center', fontSize: '1.1rem', backgroundColor: inputBg, transition: 'background-color 0.2s' }} 
                    />
                  </div>
                  
                  <div style={{ flex: 1, padding: '0 0.5rem' }}>
                    <input 
                      type="number" 
                      value={set.reps}
                      onChange={e => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                      placeholder="--"
                      className="input-base"
                      style={{ padding: '0.6rem', textAlign: 'center', fontSize: '1.1rem', backgroundColor: inputBg, transition: 'background-color 0.2s' }} 
                    />
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button 
                onClick={() => addSet(exIndex)} 
                className="btn-ghost" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', borderRadius: '4px' }}
              >
                + Empty Set
              </button>
              <button 
                onClick={() => duplicateLastSet(exIndex)} 
                className="btn-ghost" 
                style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', borderRadius: '4px' }}
              >
                + Duplicate Last
              </button>
            </div>
          </div>
        ))}
        {activeSession.sessionExercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-card)', borderRadius: '8px' }}>
            <p style={{ color: 'var(--text-muted)' }}>No exercises in this workout.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Finish to clear, or click Cancel.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
        <button onClick={finishWorkout} className="btn-primary" style={{ flex: 2, padding: '1rem', fontSize: '1.1rem', border: 'none', borderRadius: '4px' }}>Finish Workout</button>
        <button onClick={cancelWorkout} className="btn-danger" style={{ flex: 1, border: '1px solid var(--error)', borderRadius: '4px', backgroundColor: 'transparent' }}>Cancel</button>
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

  // NEW: Listen for a template launched directly from the Templates screen
  useEffect(() => {
    if (pendingTemplate && availableExercises.length > 0) {
      startWorkout(pendingTemplate);
      setPendingTemplate(null); // Clear it from memory so it doesn't fire again
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
      // Automatic completion strategy: only filter sets that have valid inputs.
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
