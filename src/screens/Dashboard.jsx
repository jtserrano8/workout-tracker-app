import React, { useState, useEffect } from 'react';
import { getHistory } from '../data/sessionStore';
import { getGoalsWithComputed } from '../data/goalStore';

function Dashboard({ setCurrentTab, setSelectedSession }) {
  const [topGoals, setTopGoals] = useState([]);
  const [todaySummary, setTodaySummary] = useState({
    completed: false,
    exercises: 0,
    duration: 0
  });

  useEffect(() => {
    // Basic logic to populate the UI structure
    const history = getHistory();
    const goals = getGoalsWithComputed().slice(0, 3);
    setTopGoals(goals);

    // Populate Today's Summary UI
    const today = new Date().toDateString();
    const todayWorkouts = history.filter(w => new Date(w.date).toDateString() === today);
    
    if (todayWorkouts.length > 0) {
      const recent = todayWorkouts[0];
      setTodaySummary({
        completed: true,
        exercises: recent.sessionExercises ? recent.sessionExercises.length : 0,
        duration: recent.durationMinutes || 0
      });
    }
  }, []);

  return (
    <div className="screen-container">
      <div style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Welcome back 👋</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>Ready to crush your goals today?</p>
      </div>
      
      {/* 1. Today's Summary */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h3 className="section-title">Today's Summary</h3>
        <div className="card" style={{ padding: '1.5rem', margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Workout Completed</span>
            <span style={{ 
              background: todaySummary.completed ? 'var(--secondary)' : 'var(--border-soft)', 
              color: todaySummary.completed ? '#fff' : 'var(--text-muted)', 
              padding: '0.35rem 0.85rem', 
              borderRadius: '20px', 
              fontSize: '0.85rem', 
              fontWeight: '600' 
            }}>
              {todaySummary.completed ? 'Yes' : 'No'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-main)', padding: '1.25rem 1rem', borderRadius: '16px', border: '1px solid var(--border-soft)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                {todaySummary.exercises}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                Exercises
              </div>
            </div>
            <div style={{ flex: 1, backgroundColor: 'var(--bg-main)', padding: '1.25rem 1rem', borderRadius: '16px', border: '1px solid var(--border-soft)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>
                {todaySummary.duration}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginLeft: '2px' }}>m</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                Duration
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Goals Progress */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 className="section-title" style={{ marginBottom: 0 }}>Goals Progress</h3>
          <button 
            onClick={() => setCurrentTab?.('goals')} 
            className="btn-ghost"
            style={{ padding: '0.5rem 0', fontSize: '0.9rem' }}
          >
            See all
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {topGoals.length > 0 ? topGoals.map(goal => {
            const pct = goal.targetValue > 0 ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)) : 0;
            const isDone = pct >= 100;
            return (
              <div key={goal.id} className="card" style={{ padding: '1.25rem', margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.85rem' }}>
                  <span style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-main)' }}>{goal.title}</span>
                  <span style={{ fontWeight: '700', fontSize: '1.1rem', color: isDone ? 'var(--secondary)' : 'var(--primary)' }}>{pct}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--border-soft)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${pct}%`, 
                    backgroundColor: isDone ? 'var(--secondary)' : 'var(--primary)',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          }) : (
            <div className="card" style={{ padding: '2rem 1.5rem', margin: 0, textAlign: 'center', borderStyle: 'dashed' }}>
              <p style={{ color: 'var(--text-muted)' }}>No active goals. Set some up to track progress!</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Quick Actions */}
      <section style={{ marginBottom: '1rem' }}>
        <h3 className="section-title">Quick Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <button 
            onClick={() => setCurrentTab?.('workout')}
            className="btn-primary"
            style={{ 
              width: '100%', 
              fontSize: '1.05rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '1.15rem'
            }}
          >
            Start Workout
          </button>
          
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <button 
              onClick={() => setCurrentTab?.('history')}
              className="btn-outline"
              style={{ flex: 1, padding: '1.15rem 1rem', fontSize: '0.95rem' }}
            >
              View History
            </button>
            <button 
              onClick={() => setCurrentTab?.('bodyweight')}
              className="btn-outline"
              style={{ flex: 1, padding: '1.15rem 1rem', fontSize: '0.95rem' }}
            >
              Log Weight
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
