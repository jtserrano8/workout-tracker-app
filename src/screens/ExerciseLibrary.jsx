import React, { useState, useEffect } from 'react';
import { getExercises, saveExercise, deleteExercise } from '../data/exerciseStore';
import { isExerciseInUse } from '../data/templateStore';
import { generateId } from '../utils/ids';
import ScreenHeader from '../components/layout/ScreenHeader';

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
        <ScreenHeader title={currentExercise ? 'Edit Exercise' : 'New Exercise'} />
        <div className="card">
          {errorMsg && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontWeight: 'bold' }}>{errorMsg}</p>}
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="input-base"
              placeholder="e.g. Bench Press"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Muscle (Optional)</label>
            <input 
              type="text" 
              value={targetMuscle} 
              onChange={e => setTargetMuscle(e.target.value)} 
              className="input-base"
              placeholder="e.g. Chest"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}>Save</button>
            <button onClick={() => setIsEditing(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <ScreenHeader title="Exercise Library">
        <button onClick={handleOpenCreate} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>+ Add</button>
      </ScreenHeader>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {exercises.map(ex => (
          <div key={ex.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
            <div onClick={() => handleOpenEdit(ex)} style={{ flex: 1, cursor: 'pointer' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{ex.name}</div>
              {ex.targetMuscle && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{ex.targetMuscle}</div>}
            </div>
            <button onClick={(e) => { e.stopPropagation(); handleDelete(ex.id); }} className="btn-danger" style={{ border: 'none', padding: '0.5rem 0 0.5rem 1rem' }}>
              Delete
            </button>
          </div>
        ))}
        {exercises.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No exercises found.</p>}
      </div>
    </div>
  );
}

export default ExerciseLibrary;
