import React, { useState, useEffect } from 'react';
import { getGoalsWithComputed, saveGoal, updateGoal, deleteGoal, computeGoalValue } from '../data/goalStore';
import { getExercises } from '../data/exerciseStore';
import ScreenHeader from '../components/layout/ScreenHeader';

const GOAL_TYPES = [
  { value: 'manual', label: 'Manual' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'workout_count', label: 'Workout Count' },
  { value: 'exercise_max', label: 'Exercise Max (lbs)' },
];

const EMPTY_FORM = { title: '', currentValue: '', targetValue: '', type: 'manual', linkedExerciseId: '' };

function GoalCard({ goal, onUpdate, onDelete, exercises }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(EMPTY_FORM);
  const [editError, setEditError] = useState('');

  const isManual = (goal.type || 'manual') === 'manual';
  const pct = goal.targetValue > 0
    ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
    : 0;
  const done = pct >= 100;

  const typeLabel = GOAL_TYPES.find(t => t.value === (goal.type || 'manual'))?.label || 'Manual';

  const handleStartEdit = () => {
    setDraft({
      title: goal.title,
      currentValue: String(goal.currentValue),
      targetValue: String(goal.targetValue),
      type: goal.type || 'manual',
      linkedExerciseId: goal.linkedExerciseId || '',
    });
    setEditError('');
    setIsEditing(true);
  };

  const handleCancel = () => { setIsEditing(false); setEditError(''); };

  const handleDraftChange = (e) => {
    const { name, value } = e.target;
    setDraft(prev => ({
      ...prev,
      [name]: value,
      // reset linkedExerciseId if type changes away from exercise_max
      ...(name === 'type' && value !== 'exercise_max' ? { linkedExerciseId: '' } : {}),
    }));
    setEditError('');
  };

  const handleSave = () => {
    if (!draft.title.trim()) return setEditError('Title is required.');
    if (draft.targetValue === '' || Number(draft.targetValue) <= 0) return setEditError('Target must be greater than 0.');
    if (draft.type === 'exercise_max' && !draft.linkedExerciseId) return setEditError('Please select an exercise.');
    if (draft.type === 'manual') {
      if (draft.currentValue === '') return setEditError('Current value is required.');
      if (Number(draft.currentValue) < 0) return setEditError('Current cannot be negative.');
    }

    const fields = {
      title: draft.title.trim(),
      targetValue: Number(draft.targetValue),
      type: draft.type,
      linkedExerciseId: draft.linkedExerciseId || null,
      currentValue: draft.type === 'manual' ? Number(draft.currentValue) : goal.currentValue,
    };
    updateGoal(goal.id, fields);
    setIsEditing(false);
    onUpdate();
  };

  return (
    <div
      className="card"
      style={{ margin: 0, padding: '1.25rem', borderLeft: `4px solid ${done ? 'var(--secondary)' : 'var(--primary)'}` }}
    >
      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            className="input-base"
            name="title"
            value={draft.title}
            onChange={handleDraftChange}
            placeholder="Goal title"
          />
          <select className="input-base" name="type" value={draft.type} onChange={handleDraftChange}>
            {GOAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          {draft.type === 'exercise_max' && (
            <select className="input-base" name="linkedExerciseId" value={draft.linkedExerciseId} onChange={handleDraftChange}>
              <option value="">— Select exercise —</option>
              {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
            </select>
          )}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {draft.type === 'manual' && (
              <input
                className="input-base"
                name="currentValue"
                type="number"
                inputMode="decimal"
                placeholder="Current"
                value={draft.currentValue}
                onChange={handleDraftChange}
                style={{ flex: 1 }}
              />
            )}
            <input
              className="input-base"
              name="targetValue"
              type="number"
              inputMode="decimal"
              placeholder="Target"
              value={draft.targetValue}
              onChange={handleDraftChange}
              style={{ flex: draft.type === 'manual' ? 1 : undefined, width: draft.type !== 'manual' ? '100%' : undefined }}
            />
          </div>
          {editError && <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>{editError}</p>}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleSave} className="btn-secondary" style={{ flex: 1, border: 'none', borderRadius: '6px', padding: '0.6rem' }}>Save</button>
            <button onClick={handleCancel} className="btn-outline" style={{ flex: 1, borderRadius: '6px', padding: '0.6rem' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1, paddingRight: '0.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '0.15rem' }}>{goal.title}</h3>
              {!isManual && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: '#2a2a2a', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                  auto · {typeLabel}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: done ? 'var(--secondary)' : 'var(--primary)' }}>{pct}%</span>
              <button onClick={handleStartEdit} className="btn-ghost" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', border: 'none', borderRadius: '4px' }}>Edit</button>
              <button onClick={() => onDelete(goal.id)} className="btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px' }}>Delete</button>
            </div>
          </div>

          <div style={{ height: '6px', backgroundColor: '#333', borderRadius: '3px', marginBottom: '0.6rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, backgroundColor: done ? 'var(--secondary)' : 'var(--primary)', borderRadius: '3px', transition: 'width 0.3s ease' }} />
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {goal.currentValue} / {goal.targetValue}
            {done && <span style={{ color: 'var(--secondary)', marginLeft: '0.5rem', fontWeight: 'bold' }}>✓ Complete</span>}
          </p>
        </>
      )}
    </div>
  );
}

function Goals() {
  const [goals, setGoals] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const refresh = () => setGoals(getGoalsWithComputed());

  useEffect(() => {
    refresh();
    setExercises(getExercises().sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && value !== 'exercise_max' ? { linkedExerciseId: '' } : {}),
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, currentValue, targetValue, type, linkedExerciseId } = form;

    if (!title.trim()) return setError('Goal title is required.');
    if (targetValue === '' || Number(targetValue) <= 0) return setError('Target must be greater than 0.');
    if (type === 'exercise_max' && !linkedExerciseId) return setError('Please select an exercise.');
    if (type === 'manual') {
      if (currentValue === '') return setError('Current value is required.');
      if (Number(currentValue) < 0) return setError('Current value cannot be negative.');
    }

    saveGoal({
      title: title.trim(),
      currentValue: type === 'manual' ? currentValue : 0,
      targetValue,
      type,
      linkedExerciseId: linkedExerciseId || null,
    });
    refresh();
    setForm(EMPTY_FORM);
    setError('');
  };

  return (
    <div className="screen-container">
      <ScreenHeader title="Goals" />

      {/* Create form */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>New Goal</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            className="input-base"
            name="title"
            placeholder="Goal title (e.g. Bench Press 225 lbs)"
            value={form.title}
            onChange={handleChange}
          />
          <select className="input-base" name="type" value={form.type} onChange={handleChange}>
            {GOAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          {form.type === 'exercise_max' && (
            <select className="input-base" name="linkedExerciseId" value={form.linkedExerciseId} onChange={handleChange}>
              <option value="">— Select exercise —</option>
              {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
            </select>
          )}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {form.type === 'manual' && (
              <input
                className="input-base"
                name="currentValue"
                type="number"
                inputMode="decimal"
                placeholder="Current"
                value={form.currentValue}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
            )}
            <input
              className="input-base"
              name="targetValue"
              type="number"
              inputMode="decimal"
              placeholder="Target"
              value={form.targetValue}
              onChange={handleChange}
              style={{ flex: form.type === 'manual' ? 1 : undefined, width: form.type !== 'manual' ? '100%' : undefined }}
            />
          </div>
          {error && <p style={{ color: 'var(--error)', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ border: 'none', borderRadius: '6px' }}>Add Goal</button>
        </form>
      </div>

      {/* Goal list */}
      {goals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', borderRadius: '8px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
          <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No goals yet.</p>
          <p style={{ fontSize: '0.9rem' }}>Add one above to start tracking your progress!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              exercises={exercises}
              onUpdate={refresh}
              onDelete={(id) => { deleteGoal(id); refresh(); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Goals;
