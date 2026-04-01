import React, { useState, useEffect } from 'react';
import { getExercises, saveExercise, deleteExercise } from '../data/exerciseStore';
import { isExerciseInUse } from '../data/templateStore';
import { generateId } from '../utils/ids';

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  
  const [name, setName] = useState('');
  const [targetMuscle, setTargetMuscle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadList();
  }, []);

  const loadList = () => {
    const list = getExercises();
    list.sort((a,b) => a.name.localeCompare(b.name));
    setExercises(list);
  };

  const handleOpenCreate = () => {
    setName('');
    setTargetMuscle('');
    setCurrentExercise(null);
    setErrorMsg('');
    setIsEditing(true);
  };

  const handleOpenEdit = (exercise) => {
    setName(exercise.name);
    setTargetMuscle(exercise.targetMuscle || '');
    setCurrentExercise(exercise);
    setErrorMsg('');
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg('Exercise name is required.');
      return;
    }

    const duplicate = exercises.find(e => 
      e.name.toLowerCase() === trimmedName.toLowerCase() && 
      (!currentExercise || e.id !== currentExercise.id)
    );
    
    if (duplicate) {
      setErrorMsg('An exercise with this name already exists.');
      return;
    }

    saveExercise({
      id: currentExercise ? currentExercise.id : generateId(),
      name: trimmedName,
      targetMuscle: targetMuscle.trim(),
    });

    setIsEditing(false);
    loadList();
  };

  const handleDelete = (id) => {
    if (isExerciseInUse(id)) {
      alert('Cannot delete this exercise because it is used in a Workout Template.');
      return;
    }
    deleteExercise(id);
    loadList();
  };

  if (isEditing) {
    return (
      <div className="screen-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
          <h1 className="screen-title" style={{ marginBottom: 0 }}>
            {currentExercise ? 'Edit Exercise' : 'New Exercise'}
          </h1>
        </div>

        <div className="card">
          {errorMsg && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontWeight: 'bold' }}>{errorMsg}</p>}
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Name *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="input-base"
              placeholder="e.g. Bench Press"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: '600' }}>Target Muscle (Optional)</label>
            <input 
              type="text" 
              value={targetMuscle} 
              onChange={e => setTargetMuscle(e.target.value)} 
              className="input-base"
              placeholder="e.g. Chest"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}>Save</button>
            <button onClick={() => setIsEditing(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Exercise Library</h1>
        <button onClick={handleOpenCreate} className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>+ Add</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {exercises.map(ex => (
          <div key={ex.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0, padding: '1.25rem' }}>
            <div onClick={() => handleOpenEdit(ex)} style={{ flex: 1, cursor: 'pointer' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-main)' }}>{ex.name}</div>
              {ex.targetMuscle && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{ex.targetMuscle}</div>}
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(ex.id); }} className="btn-danger" style={{ border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
              Delete
            </button>
          </div>
        ))}
        {exercises.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', borderRadius: '18px', border: '1px dashed var(--border-soft)' }}>
            <p style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '0.5rem' }}>No exercises found.</p>
            <p style={{ fontSize: '0.9rem' }}>Add an exercise to build your library!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExerciseLibrary;
