import React, { useState, useEffect } from 'react';
import { getTemplates } from '../data/templateStore';
import { getHistory } from '../data/sessionStore';
import { formatDate } from '../utils/date';
import ScreenHeader from '../components/layout/ScreenHeader';

function Dashboard({ setCurrentTab, setSelectedSession }) {
  const [stats, setStats] = useState({
    templatesCount: 0,
    historyCount: 0,
    recentWorkout: null
  });

  useEffect(() => {
    const templates = getTemplates();
    const history = getHistory();
    setStats({
      templatesCount: templates.length,
      historyCount: history.length,
      recentWorkout: history.length > 0 ? history[0] : null
    });
  }, []);

  return (
    <div className="screen-container">
      <ScreenHeader title="Welcome Back!" />
      
      {/* Overview Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ flex: 1, margin: 0, textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.templatesCount}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Templates</div>
        </div>
        <div className="card" style={{ flex: 1, margin: 0, textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.historyCount}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Workouts</div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>Most Recent Workout</h3>
      {stats.recentWorkout ? (
        <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{stats.recentWorkout.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {formatDate(stats.recentWorkout.date)} • {stats.recentWorkout.durationMinutes} min
              </p>
            </div>
            <button 
              onClick={() => {
                setSelectedSession?.(stats.recentWorkout);
                setCurrentTab?.('history');
              }} 
              className="btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              View
            </button>
          </div>
        </div>
      ) : (
        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px dashed #666' }}>
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No workouts tracked yet. Time to get lifting!</p>
        </div>
      )}

      {/* Quick Actions */}
      <h3 style={{ marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>Quick Actions</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button className="btn-outline" onClick={() => setCurrentTab?.('workout')} style={{ width: '100%', padding: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2a2a2a', border: 'none', borderRadius: '8px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>▶ Start a Workout</span>
          <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>→</span>
        </button>
        <button className="btn-outline" onClick={() => setCurrentTab?.('templates')} style={{ width: '100%', padding: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2a2a2a', border: 'none', borderRadius: '8px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>📋 Manage Templates</span>
          <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>→</span>
        </button>
        <button className="btn-outline" onClick={() => setCurrentTab?.('history')} style={{ width: '100%', padding: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2a2a2a', border: 'none', borderRadius: '8px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>📅 View History</span>
          <span style={{ color: 'var(--primary)', fontSize: '1.2rem' }}>→</span>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
