import React, { useState, useEffect } from 'react';
import { getTemplates, saveTemplate, deleteTemplate } from '../data/templateStore';
import { getExercises } from '../data/exerciseStore';
import { generateId } from '../utils/ids';

function Templates({ startTemplate, activeSession, resumeCurrentWorkout }) {
  const [templates, setTemplates] = useState([]);
  const [templateToConfirm, setTemplateToConfirm] = useState(null);

  const handleStartTemplate = (tpl) => {
    if (activeSession) {
      setTemplateToConfirm(tpl);
    } else {
      startTemplate(tpl);
    }
  };
  const [availableExercises, setAvailableExercises] = useState([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  useEffect(() => {
    loadList();
    setAvailableExercises(getExercises());
  }, []);

  const loadList = () => {
    setTemplates(getTemplates());
  };

  const handleOpenCreate = () => {
    setName('');
    setNotes('');
    setSelectedExercises([]);
    setCurrentTemplate(null);
    setErrorMsg('');
    setIsEditing(true);
    setShowExercisePicker(false);
  };

  const handleOpenEdit = (template) => {
    setName(template.name);
    setNotes(template.notes || '');
    setSelectedExercises(template.exercises || []);
    setCurrentTemplate(template);
    setErrorMsg('');
    setIsEditing(true);
    setShowExercisePicker(false);
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMsg('Template name is required.');
      return;
    }

    saveTemplate({
      id: currentTemplate ? currentTemplate.id : generateId(),
      name: trimmedName,
      notes: notes.trim(),
      exercises: selectedExercises,
    });
    setIsEditing(false);
    loadList();
  };

  const handleDelete = (id) => {
    deleteTemplate(id);
    loadList();
  };

  const moveExercise = (index, direction) => {
    const newExs = [...selectedExercises];
    if (direction === 'up' && index > 0) {
      [newExs[index - 1], newExs[index]] = [newExs[index], newExs[index - 1]];
    } else if (direction === 'down' && index < newExs.length - 1) {
      [newExs[index + 1], newExs[index]] = [newExs[index], newExs[index + 1]];
    }
    setSelectedExercises(newExs);
  };

  const removeExercise = (idToRemove) => {
    setSelectedExercises(selectedExercises.filter(id => id !== idToRemove));
  };

  const toggleExerciseSelection = (id) => {
    if (selectedExercises.includes(id)) {
      removeExercise(id);
    } else {
      setSelectedExercises([...selectedExercises, id]);
    }
  };

  const getExerciseName = (id) => {
    const ex = availableExercises.find(e => e.id === id);
    return ex ? ex.name : 'Unknown Exercise';
  };

  if (templateToConfirm) {
    return (
      <div className="screen-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
          <h1 className="screen-title" style={{ marginBottom: 0 }}>Workout in Progress</h1>
        </div>
        <div className="card" style={{ padding: '32px 24px', textAlign: 'center', margin: '0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ color: 'var(--text-main)', marginBottom: '16px', fontSize: '1.4rem', fontWeight: 'bold' }}>Resume or Restart?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: '1.5', fontSize: '0.95rem' }}>
            You currently have a <strong>{activeSession.name}</strong> session active. Do you want to continue it, or discard it and start <strong>{templateToConfirm.name}</strong>?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <button 
               onClick={() => {
                 resumeCurrentWorkout();
                 setTemplateToConfirm(null);
               }}
               className="btn-primary"
               style={{ width: '100%' }}
             >
               Resume Current Workout
             </button>
             <button 
               onClick={() => {
                 startTemplate(templateToConfirm);
                 setTemplateToConfirm(null);
               }} 
               className="btn-danger" 
               style={{ width: '100%' }}
             >
               Discard & Start New
             </button>
             <button 
               onClick={() => setTemplateToConfirm(null)}
               className="btn-outline"
               style={{ width: '100%' }}
             >
               Cancel
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    if (showExercisePicker) {
      return (
         <div className="screen-container">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
             <h1 className="screen-title" style={{ marginBottom: 0 }}>Select Exercises</h1>
             <button onClick={() => setShowExercisePicker(false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Done</button>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
             {availableExercises.map(ex => {
               const isSelected = selectedExercises.includes(ex.id);
               return (
                 <div 
                   key={ex.id} 
                   className="card" 
                   onClick={() => toggleExerciseSelection(ex.id)}
                   style={{ 
                     display: 'flex', justifyContent: 'space-between', cursor: 'pointer', margin: 0, padding: '16px 20px',
                     border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-soft)'
                   }}
                 >
                   <span style={{ fontWeight: isSelected ? 'bold' : '600', color: 'var(--text-main)' }}>{ex.name}</span>
                   {isSelected && <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>}
                 </div>
               );
             })}
             {availableExercises.length === 0 && (
               <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', borderRadius: '18px', border: '1px dashed var(--border-soft)' }}>
                 <p style={{ color: 'var(--text-main)', fontWeight: 'bold', marginBottom: '8px' }}>No exercises found.</p>
                 <p style={{ fontSize: '0.9rem' }}>Go to the Library to add some!</p>
               </div>
             )}
           </div>
         </div>
      );
    }

    return (
      <div className="screen-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
          <h1 className="screen-title" style={{ marginBottom: 0 }}>
            {currentTemplate ? 'Edit Template' : 'New Template'}
          </h1>
        </div>
        
        <div className="card">
          {errorMsg && <p style={{ color: 'var(--error)', marginBottom: '16px', fontWeight: 'bold' }}>{errorMsg}</p>}
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: 'bold' }}>Template Name *</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="input-base"
              placeholder="e.g. Push Day"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-main)', fontWeight: 'bold' }}>Notes (Optional)</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
              className="input-base"
              style={{ minHeight: '80px', fontFamily: 'inherit' }}
              placeholder="e.g. Focus on mind-muscle connection"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Exercises</label>
              <button onClick={() => setShowExercisePicker(true)} className="btn-ghost" style={{ padding: 0, fontWeight: 'bold' }}>
                + Add Exercises
              </button>
            </div>
            
            {selectedExercises.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600', backgroundColor: 'var(--bg-main)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--border-soft)', textAlign: 'center' }}>
                No exercises added yet. Tap above to select them.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedExercises.map((exId, idx) => (
                  <div key={`${exId}-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-main)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-soft)' }}>
                    <div style={{ flex: 1, paddingRight: '8px', color: 'var(--text-main)', fontWeight: '600' }}>
                      <span style={{ color: 'var(--text-muted)', marginRight: '8px', fontWeight: 'bold' }}>{idx + 1}.</span> 
                      {getExerciseName(exId)}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => moveExercise(idx, 'up')} disabled={idx === 0} className="btn-outline" style={{ padding: '6px 10px', fontSize: '0.85rem', opacity: idx === 0 ? 0.3 : 1 }}>↑</button>
                      <button onClick={() => moveExercise(idx, 'down')} disabled={idx === selectedExercises.length - 1} className="btn-outline" style={{ padding: '6px 10px', fontSize: '0.85rem', opacity: idx === selectedExercises.length - 1 ? 0.3 : 1 }}>↓</button>
                      <button onClick={() => removeExercise(exId)} className="btn-danger" style={{ padding: '6px 10px', fontSize: '0.85rem' }}>X</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={handleSave} className="btn-primary" style={{ flex: 1 }}>Save Template</button>
            <button onClick={() => setIsEditing(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Workout Templates</h1>
        <button onClick={handleOpenCreate} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Create</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {templates.map(tpl => (
          <div key={tpl.id} className="card" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 className="section-title" style={{ marginBottom: '4px', color: 'var(--text-main)', fontWeight: 'bold' }}>{tpl.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '500' }}>
                  {tpl.exercises?.length || 0} Exercises
                </p>
              </div>
              <button onClick={() => handleStartTemplate(tpl)} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '12px' }}>
                Start
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-soft)', paddingTop: '16px' }}>
              <button onClick={() => handleOpenEdit(tpl)} className="btn-outline" style={{ flex: 1, color: 'var(--primary)', borderColor: 'var(--primary)' }}>Edit</button>
              <button onClick={() => handleDelete(tpl.id)} className="btn-danger" style={{ flex: 1 }}>Delete</button>
            </div>
          </div>
        ))}
        
        {templates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', borderRadius: '18px', border: '1px dashed var(--border-soft)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-main)', fontWeight: 'bold' }}>No templates created yet.</p>
            <p style={{ fontSize: '0.95rem' }}>Tap the "+ Create" button above to build your very first routine!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Templates;
