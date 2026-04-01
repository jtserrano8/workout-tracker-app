import { loadData, saveData } from './storage';
import { generateId } from '../utils/ids';

const GOAL_KEY = 'wt_goals';

export function getGoals() {
  return loadData(GOAL_KEY) || [];
}

export function saveGoal(title, currentValue, targetValue) {
  const goals = getGoals();
  const newGoal = {
    id: generateId(),
    title,
    currentValue: Number(currentValue),
    targetValue: Number(targetValue),
  };
  goals.unshift(newGoal);
  saveData(GOAL_KEY, goals);
  return newGoal;
}

export function updateGoal(id, fields) {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...fields };
    saveData(GOAL_KEY, goals);
  }
}

export function deleteGoal(id) {
  const goals = getGoals().filter(g => g.id !== id);
  saveData(GOAL_KEY, goals);
}
