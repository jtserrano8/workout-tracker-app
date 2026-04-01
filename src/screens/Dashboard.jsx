import React, { useState, useEffect } from 'react';
import { getTemplates } from '../data/templateStore';
import { getHistory } from '../data/sessionStore';
import { getGoalsWithComputed } from '../data/goalStore';
import { formatDate } from '../utils/date';
import ScreenHeader from '../components/layout/ScreenHeader';

function Dashboard({ setCurrentTab, setSelectedSession }) {
  const [stats, setStats] = useState({
    templatesCount: 0,
    historyCount: 0,
    recentWorkout: null
  });
  const [topGoals, setTopGoals] = useState([]);

  useEffect(() => {
    const templates = getTemplates();
    const history = getHistory();
    setStats({
      templatesCount: templates.length,
      historyCount: history.length,
      recentWorkout: history.length > 0 ? history[0] : null
    });
    setTopGoals(getGoalsWithComputed().slice(0, 3));
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

      {/* Goals Preview */}
      {topGoals.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', marginBottom: '1rem' }}>
            <h3 style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Goals</h3>
            <button
              onClick={() => setCurrentTab?.('goals')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.9rem', padding: 0, cursor: 'pointer', fontWeight: '600' }}
            >
              See all →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topGoals.map(goal => {
              const pct = goal.targetValue > 0
                ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
                : 0;
              const done = pct >= 100;
              return (
                <div
                  key={goal.id}
                  className="card"
                  style={{ margin: 0, padding: '1rem', borderLeft: `4px solid ${done ? 'var(--secondary)' : 'var(--primary)'}` }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1rem', color: 'white', flex: 1, paddingRight: '0.5rem' }}>{goal.title}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: done ? 'var(--secondary)' : 'var(--primary)', flexShrink: 0 }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ height: '5px', backgroundColor: '#333', borderRadius: '3px', marginBottom: '0.4rem', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: done ? 'var(--secondary)' : 'var(--primary)',
                      borderRadius: '3px'
                    }} />
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {goal.currentValue} / {goal.targetValue}
                    {done && <span style={{ color: 'var(--secondary)', marginLeft: '0.5rem', fontWeight: 'bold' }}>✓</span>}
                  </p>
                </div>
              );
            })}
          </div>
        </>
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
