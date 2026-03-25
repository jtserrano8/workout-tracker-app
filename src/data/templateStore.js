import { loadData, saveData } from './storage';

const TEMPLATE_KEY = 'wt_templates';

export function getTemplates() {
  return loadData(TEMPLATE_KEY, []);
}

export function saveTemplate(template) {
  const templates = getTemplates();
  const index = templates.findIndex(t => t.id === template.id);
  if (index >= 0) {
    templates[index] = template;
  } else {
    templates.push(template);
  }
  saveData(TEMPLATE_KEY, templates);
}

export function deleteTemplate(id) {
  const templates = getTemplates().filter(t => t.id !== id);
  saveData(TEMPLATE_KEY, templates);
}

export function isExerciseInUse(exerciseId) {
  const templates = getTemplates();
  return templates.some(t => t.exercises && t.exercises.includes(exerciseId));
}
