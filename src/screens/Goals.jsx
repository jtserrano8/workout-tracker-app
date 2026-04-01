import React, { useState, useEffect } from 'react';
import { getGoals, saveGoal, updateGoal, deleteGoal } from '../data/goalStore';
import ScreenHeader from '../components/layout/ScreenHeader';

const EMPTY_FORM = { title: '', currentValue: '', targetValue: '' };

function GoalCard({ goal, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(EMPTY_FORM);
  const [editError, setEditError] = useState('');

  const pct = goal.targetValue > 0
    ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
    : 0;
  const done = pct >= 100;

  const handleStartEdit = () => {
    setDraft({ title: goal.title, currentValue: String(goal.currentValue), targetValue: String(goal.targetValue) });
    setEditError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditError('');
  };

  const handleDraftChange = (e) => {
    setDraft(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setEditError('');
  };

  const handleSave = () => {
    if (!draft.title.trim()) return setEditError('Title is required.');
    if (draft.currentValue === '' || draft.targetValue === '') return setEditError('Current and target are required.');
    if (Number(draft.targetValue) <= 0) return setEditError('Target must be greater than 0.');
    if (Number(draft.currentValue) < 0) return setEditError('Current cannot be negative.');

    updateGoal(goal.id, {
      title: draft.title.trim(),
      currentValue: Number(draft.currentValue),
      targetValue: Number(draft.targetValue),
    });
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
          <div style={{ display: 'flex', gap: '0.75rem' }}>
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
            <input
              className="input-base"
              name="targetValue"
              type="number"
              inputMode="decimal"
              placeholder="Target"
              value={draft.targetValue}
              onChange={handleDraftChange}
              style={{ flex: 1 }}
            />
          </div>
          {editError && <p style={{ color: 'var(--error)', fontSize: '0.85rem' }}>{editError}</p>}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSave}
              className="btn-secondary"
              style={{ flex: 1, border: 'none', borderRadius: '6px', padding: '0.6rem' }}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="btn-outline"
              style={{ flex: 1, borderRadius: '6px', padding: '0.6rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'white', flex: 1, paddingRight: '0.5rem' }}>{goal.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: done ? 'var(--secondary)' : 'var(--primary)' }}>
                {pct}%
              </span>
              <button
                onClick={handleStartEdit}
                className="btn-ghost"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', border: 'none', borderRadius: '4px' }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(goal.id)}
                className="btn-danger"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px' }}
              >
                Delete
              </button>
            </div>
          </div>

          <div style={{ height: '6px', backgroundColor: '#333', borderRadius: '3px', marginBottom: '0.6rem', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              backgroundColor: done ? 'var(--secondary)' : 'var(--primary)',
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }} />
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
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const refresh = () => setGoals(getGoals());

  useEffect(() => {
    refresh();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, currentValue, targetValue } = form;

    if (!title.trim()) return setError('Goal title is required.');
    if (currentValue === '' || targetValue === '') return setError('Current and target values are required.');
    if (Number(targetValue) <= 0) return setError('Target must be greater than 0.');
    if (Number(currentValue) < 0) return setError('Current value cannot be negative.');

    saveGoal(title.trim(), currentValue, targetValue);
    refresh();
    setForm(EMPTY_FORM);
    setError('');
  };

  const handleDelete = (id) => {
    deleteGoal(id);
    refresh();
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
          <div style={{ display: 'flex', gap: '0.75rem' }}>
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
            <input
              className="input-base"
              name="targetValue"
              type="number"
              inputMode="decimal"
              placeholder="Target"
              value={form.targetValue}
              onChange={handleChange}
              style={{ flex: 1 }}
            />
          </div>
          {error && <p style={{ color: 'var(--error)', fontSize: '0.9rem' }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ border: 'none', borderRadius: '6px' }}>
            Add Goal
          </button>
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
              onUpdate={refresh}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Goals;
