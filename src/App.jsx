import React, { useState } from 'react';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './screens/Dashboard';
import Templates from './screens/Templates';
import ActiveWorkout from './screens/ActiveWorkout';
import History from './screens/History';
import ExerciseLibrary from './screens/ExerciseLibrary';
import Bodyweight from './screens/Bodyweight';
import Goals from './screens/Goals';
import { getActiveSession, saveActiveSession } from './data/sessionStore';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedSession, setSelectedSession] = useState(null);

  // V2: Persist in-progress workout state across tabs and reloads
  const [activeSession, setActiveSessionState] = useState(() => getActiveSession());
  const [pendingTemplate, setPendingTemplate] = useState(null);

  const handleSetActiveSession = (session) => {
    setActiveSessionState(session);
    saveActiveSession(session);
  };

  const startTemplate = (template) => {
    setPendingTemplate(template);
    setCurrentTab('workout');
  };

  const resumeCurrentWorkout = () => {
    setCurrentTab('workout');
  };

  const renderScreen = () => {
    switch (currentTab) {
      case 'dashboard': return <Dashboard setCurrentTab={setCurrentTab} setSelectedSession={setSelectedSession} />;
      case 'bodyweight': return <Bodyweight />;
      case 'templates': return <Templates startTemplate={startTemplate} activeSession={activeSession} resumeCurrentWorkout={resumeCurrentWorkout} />;
      case 'workout': return <ActiveWorkout activeSession={activeSession} setActiveSession={handleSetActiveSession} pendingTemplate={pendingTemplate} setPendingTemplate={setPendingTemplate} />;
      case 'history': return <History selectedSession={selectedSession} setSelectedSession={setSelectedSession} />;
      case 'goals': return <Goals />;
      case 'library': return <ExerciseLibrary />;
      default: return <Dashboard setCurrentTab={setCurrentTab} setSelectedSession={setSelectedSession} />;
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        {renderScreen()}
      </main>
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </div>
  );
}

export default App;
