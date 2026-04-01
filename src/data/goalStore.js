import { loadData, saveData } from './storage';
import { generateId } from '../utils/ids';
import { getHistory } from './sessionStore';
import { getWeights } from './weightStore';

const GOAL_KEY = 'wt_goals';

export function getGoals() {
  return loadData(GOAL_KEY) || [];
}

// Computes currentValue for smart goal types; falls through to stored value for manual
export function computeGoalValue(goal) {
  const type = goal.type || 'manual';
  if (type === 'bodyweight') {
    const weights = getWeights();
    return weights.length > 0 ? weights[0].weight : goal.currentValue;
  }
  if (type === 'workout_count') {
    return getHistory().length;
  }
  if (type === 'exercise_max') {
    const history = getHistory();
    let max = 0;
    for (const session of history) {
      for (const ex of session.sessionExercises || []) {
        if (ex.exerciseId === goal.linkedExerciseId) {
          for (const set of ex.sets || []) {
            const w = Number(set.weight);
            if (w > max) max = w;
          }
        }
      }
    }
    return max;
  }
  return goal.currentValue;
}

// Returns goals with currentValue auto-populated for smart types
export function getGoalsWithComputed() {
  return getGoals().map(g => ({ ...g, currentValue: computeGoalValue(g) }));
}

export function saveGoal({ title, currentValue, targetValue, type = 'manual', linkedExerciseId = null }) {
  const goals = getGoals();
  const newGoal = {
    id: generateId(),
    title,
    currentValue: Number(currentValue),
    targetValue: Number(targetValue),
    type,
    linkedExerciseId,
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
