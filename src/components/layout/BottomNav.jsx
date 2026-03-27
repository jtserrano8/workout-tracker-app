import React from 'react';

function BottomNav({ currentTab, setCurrentTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'workout', label: 'Workout', icon: '💪' },
    { id: 'templates', label: 'Routines', icon: '📋' },
    { id: 'history', label: 'History', icon: '📅' },
    { id: 'bodyweight', label: 'Weight', icon: '⚖️' },
    { id: 'library', label: 'Library', icon: '📚' }
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-button ${currentTab === tab.id ? 'active' : ''}`}
          onClick={() => setCurrentTab?.(tab.id)}
        >
          <div className="nav-icon">{tab.icon}</div>
          <div className="nav-label">{tab.label}</div>
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
