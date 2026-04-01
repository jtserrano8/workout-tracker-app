import { loadData, saveData } from './storage';

const SESSION_KEY = 'wt_history';
const ACTIVE_SESSION_KEY = 'wt_active_session';

export function getHistory() {
  return loadData(SESSION_KEY) || [];
}

export function saveSession(session) {
  const history = getHistory();
  // Puts newest sessions at the front of the list natively
  history.unshift(session);
  saveData(SESSION_KEY, history);
}

export function getPreviousWorkoutString(exerciseId) {
  const history = getHistory();
  // History is automatically sorted newest-first
  for (const session of history) {
    const foundEx = session.sessionExercises.find(ex => ex.exerciseId === exerciseId);
    if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
      const setStrings = foundEx.sets.map(s => `${s.weight} x ${s.reps}`);
      return `Last time: ${setStrings.join(', ')}`;
    }
  }
  return null;
}

export function getPreviousWorkoutSets(exerciseId) {
  const history = getHistory();

  // Loop through workouts (newest first)
  for (const session of history) {
    const foundEx = session.sessionExercises.find(
      ex => ex.exerciseId === exerciseId
    );

    if (foundEx && foundEx.sets && foundEx.sets.length > 0) {
      return foundEx.sets.map(set => ({
        weight: String(set.weight),
        reps: String(set.reps)
      }));
    }
  }

  return [];
}
// --- V2: EDIT SAVED SESSION ---
export function updateSession(updatedSession) {
  const history = getHistory();
  const index = history.findIndex(s => s.id === updatedSession.id);
  if (index !== -1) {
    history[index] = updatedSession;
    saveData(SESSION_KEY, history);
  }
}

// --- V2: ACTIVE SESSION PERSISTENCE ---
export function getActiveSession() {
  return loadData(ACTIVE_SESSION_KEY) || null;
}

export function saveActiveSession(session) {
  if (session) {
    saveData(ACTIVE_SESSION_KEY, session);
  } else {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }
}
