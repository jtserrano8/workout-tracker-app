import { loadData, saveData } from './storage';
import { seedExercises } from './seedExercises';

const EXERCISE_KEY = 'wt_exercises';

export function getExercises() {
  const data = loadData(EXERCISE_KEY, null);
  if (!data) {
    // initialize with seed data first time
    saveData(EXERCISE_KEY, seedExercises);
    return seedExercises;
  }
  return data;
}

export function saveExercise(exercise) {
  const exercises = getExercises();
  const index = exercises.findIndex(e => e.id === exercise.id);
  if (index >= 0) {
    exercises[index] = exercise;
  } else {
    exercises.push(exercise);
  }
  saveData(EXERCISE_KEY, exercises);
}

export function deleteExercise(id) {
  const exercises = getExercises().filter(e => e.id !== id);
  saveData(EXERCISE_KEY, exercises);
}
