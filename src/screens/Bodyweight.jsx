import React, { useState, useEffect } from 'react';
import { getWeights, saveWeight } from '../data/weightStore';
import { generateId } from '../utils/ids';
import { isValidNumber } from '../utils/validation';
import { formatDate } from '../utils/date';

function Bodyweight() {
  const [weights, setWeights] = useState([]);
  const [weightInput, setWeightInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setWeights(getWeights());
  }, []);

  const handleLogWeight = () => {
    if (!isValidNumber(weightInput)) {
      setErrorMsg('Please enter a valid number for your bodyweight.');
      return;
    }

    const newEntry = {
      id: generateId(),
      date: new Date().toISOString(),
      weight: parseFloat(weightInput)
    };

    saveWeight(newEntry);
    setWeights(getWeights()); // refresh list securely
    setWeightInput('');
    setErrorMsg('');
  };

  return (
    <div className="screen-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '16px' }}>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Bodyweight</h1>
      </div>
      
      <div className="card" style={{ marginBottom: '24px', marginInline: 0 }}>
        <h3 className="section-title">Log Today's Weight</h3>
        
        {errorMsg && (
          <p style={{ color: 'var(--error)', marginBottom: '16px', fontWeight: 'bold', fontSize: '0.9rem' }}>{errorMsg}</p>
        )}

        <div style={{ display: 'flex', gap: '16px' }}>
          <input 
            type="number"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="e.g. 185"
            className="input-base"
            style={{ flex: 1 }}
          />
          <button onClick={handleLogWeight} className="btn-primary">
            Log Weight
          </button>
        </div>
      </div>

      <h3 className="section-title" style={{ marginBottom: '16px' }}>History</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {weights.map((entry) => (
          <div key={entry.id} className="card" style={{ margin: 0, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>{formatDate(entry.date)}</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>{entry.weight} lbs</span>
          </div>
        ))}

        {weights.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', borderRadius: '18px', border: '1px dashed var(--border-soft)' }}>
            <p style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '8px' }}>No bodyweight entries yet.</p>
            <p style={{ fontSize: '0.9rem' }}>Track your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bodyweight;
