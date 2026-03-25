import React from 'react';

function BottomNav({ currentTab, setCurrentTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'templates', label: 'Templates' },
    { id: 'workout', label: 'Workout' },
    { id: 'history', label: 'History' },
    { id: 'library', label: 'Exercises' }
  ];

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      display: 'flex', justifyContent: 'space-around',
      backgroundColor: 'var(--bg-nav)', padding: '1rem 0',
      borderTop: '1px solid #333'
    }}>
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => setCurrentTab(tab.id)}
          style={{
            background: 'none',
            color: currentTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
            border: 'none',
            padding: '0.25rem',
            fontWeight: currentTab === tab.id ? 'bold' : 'normal',
            fontSize: '0.9rem'
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
