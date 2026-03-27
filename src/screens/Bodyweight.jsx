import React, { useState, useEffect } from 'react';
import { getWeights, saveWeight } from '../data/weightStore';
import { generateId } from '../utils/ids';
import { isValidNumber } from '../utils/validation';
import { formatDate } from '../utils/date';
import ScreenHeader from '../components/layout/ScreenHeader';

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
      <ScreenHeader title="Bodyweight" />
      
      <div className="card" style={{ marginBottom: '1.5rem', marginInline: 0 }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1.1rem' }}>Log Today's Weight</h3>
        
        {errorMsg && (
          <p style={{ color: 'var(--error)', marginBottom: '1rem', fontWeight: 'bold', fontSize: '0.9rem' }}>{errorMsg}</p>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <input 
            type="number"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="e.g. 185"
            className="input-base"
            style={{ flex: 1 }}
          />
          <button onClick={handleLogWeight} className="btn-primary" style={{ padding: '0 1.5rem', borderRadius: '4px', border: 'none' }}>
            Log Weight
          </button>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>History</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {weights.map((entry) => (
          <div key={entry.id} className="card" style={{ margin: 0, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)' }}>{formatDate(entry.date)}</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>{entry.weight} lbs</span>
          </div>
        ))}

        {weights.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem' }}>
            No bodyweight entries yet. Track your first one above!
          </p>
        )}
      </div>
    </div>
  );
}

export default Bodyweight;
