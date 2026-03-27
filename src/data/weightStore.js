import { loadData, saveData } from './storage';

const WEIGHT_KEY = 'wt_bodyweight';

export function getWeights() {
  return loadData(WEIGHT_KEY) || [];
}

export function saveWeight(entry) {
  const weights = getWeights();
  weights.unshift(entry); // Ensure newest first immediately upon insertion
  saveData(WEIGHT_KEY, weights);
}
