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
