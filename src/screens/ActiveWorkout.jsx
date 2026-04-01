import React, { useState, useEffect } from 'react';
import { getTemplates } from '../data/templateStore';
import { getExercises } from '../data/exerciseStore';
import { saveSession, getPreviousWorkoutString, getPreviousWorkoutSets } from '../data/sessionStore';
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
    <div className="screen-container" style={{ paddingBottom: '90px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
          {activeSession.name}
        </h1>
        <div style={{ 
          color: 'var(--bg-dark)', 
          fontWeight: '700', 
          fontSize: '0.85rem', 
          backgroundColor: 'var(--secondary)', 
          padding: '0.35rem 0.75rem', 
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(3, 218, 198, 0.3)'
        }}>
          ACTIVE
        </div>
      </div>

      {warningMsg && (
        <div style={{ backgroundColor: 'rgba(207, 102, 121, 0.15)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(207, 102, 121, 0.4)' }}>
          <p style={{ color: 'var(--error)', fontWeight: '600', margin: 0, fontSize: '0.95rem' }}>{warningMsg}</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {activeSession.sessionExercises.map((ex, exIndex) => (
          <div key={ex.id} style={{ 
            backgroundColor: '#1e1e1e', 
            borderRadius: '20px', 
            padding: '1.25rem',
            border: '1px solid rgba(255,255,255,0.03)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)' 
          }}>
            <h3 style={{ marginBottom: ex.previousString ? '0.35rem' : '1.25rem', color: 'var(--primary)', fontSize: '1.2rem', fontWeight: '700' }}>
              {ex.exerciseName}
            </h3>
            {ex.previousString && (
              <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '0.85rem', 
                marginBottom: '1.25rem', 
                fontWeight: '500',
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                display: 'inline-block'
              }}>
                {ex.previousString.includes('↻ Last:') ? ex.previousString : `↻ Last: ${ex.previousString}`}
              </p>
            )}
            
            <div style={{ display: 'flex', marginBottom: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <div style={{ width: '40px', textAlign: 'center' }}>Set</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Lbs</div>
              <div style={{ flex: 1, textAlign: 'center' }}>Reps</div>
            </div>

            {ex.sets.map((set, setIndex) => {
              const isSetValid = isValidNumber(set.weight) && isValidNumber(set.reps);
              const rowBorder = isSetValid ? '1px solid rgba(3, 218, 198, 0.4)' : '1px solid rgba(255,255,255,0.05)';
              const rowBg = isSetValid ? 'rgba(3, 218, 198, 0.05)' : 'transparent';
              
              return (
                <div key={set.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginBottom: '0.75rem', 
                  border: rowBorder, 
                  backgroundColor: rowBg,
                  padding: '0.5rem', 
                  borderRadius: '12px', 
                  transition: 'all 0.2s ease' 
                }}>
                  <div style={{ width: '40px', fontWeight: '700', color: isSetValid ? 'var(--secondary)' : 'var(--text-muted)', textAlign: 'center', fontSize: '1rem' }}>
                    {setIndex + 1}
                  </div>
                  
                  <div style={{ flex: 1, padding: '0 0.5rem' }}>
                    <input 
                      type="number" 
                      className="input-base"
                      value={set.weight}
                      onChange={e => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                      placeholder={ex.previousSets?.[setIndex]?.weight || '--'}
                      style={{ 
                        width: '100%',
                        padding: '0.75rem', 
                        textAlign: 'center', 
                        fontSize: '1.1rem', 
                        fontWeight: '600',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        color: 'var(--text-main)',
                        border: 'none',
                        borderRadius: '8px',
                        outline: 'none'
                      }} 
                    />
                  </div>
                  
                  <div style={{ flex: 1, padding: '0 0.5rem' }}>
                    <input 
                      type="number" 
                      className="input-base"
                      value={set.reps}
                      onChange={e => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                      placeholder={ex.previousSets?.[setIndex]?.reps || '--'}
                      style={{ 
                        width: '100%',
                        padding: '0.75rem', 
                        textAlign: 'center', 
                        fontSize: '1.1rem', 
                        fontWeight: '600',
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        color: 'var(--text-main)',
                        border: 'none',
                        borderRadius: '8px',
                        outline: 'none'
                      }} 
                    />
                  </div>
                </div>
              );
            })}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button 
                onClick={() => duplicateLastSet(exIndex)} 
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.95rem', fontWeight: '600', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', border: 'none' }}
              >
                + Duplicate Last
              </button>
              <button 
                onClick={() => addSet(exIndex)} 
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.95rem', fontWeight: '600', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--primary)', border: 'none' }}
              >
                + Empty Set
              </button>
            </div>
          </div>
        ))}

        {activeSession.sessionExercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', backgroundColor: '#1e1e1e', borderRadius: '20px', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '600' }}>No exercises yet.</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Add some to your template first.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2.5rem', marginBottom: '2rem' }}>
        <button 
          onClick={finishWorkout} 
          style={{ 
            width: '100%', 
            padding: '1.25rem', 
            fontSize: '1.1rem', 
            fontWeight: '700', 
            border: 'none', 
            borderRadius: '16px', 
            backgroundColor: 'var(--primary)', 
            color: 'var(--bg-dark)',
            boxShadow: '0 4px 16px rgba(187, 134, 252, 0.3)'
          }}
        >
          Finish Workout
        </button>
        <button 
          onClick={cancelWorkout} 
          style={{ 
            width: '100%', 
            padding: '1rem', 
            fontSize: '1rem', 
            fontWeight: '600', 
            border: '1px solid rgba(207, 102, 121, 0.5)', 
            borderRadius: '16px', 
            backgroundColor: 'transparent', 
            color: 'var(--error)' 
          }}
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
