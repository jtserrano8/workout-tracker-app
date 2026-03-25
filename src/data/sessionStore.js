import { loadData, saveData } from './storage';

const SESSION_KEY = 'wt_history';

export function getHistory() {
  return loadData(SESSION_KEY, []);
}

export function saveSession(session) {
  const history = getHistory();
  // Puts newest sessions at the front of the list natively
  history.unshift(session);
  saveData(SESSION_KEY, history);
}
