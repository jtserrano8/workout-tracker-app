export function loadData(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (error) {
    console.error(`Error loading ${key} from LocalStorage`, error);
    return defaultVal;
  }
}

export function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to LocalStorage`, error);
  }
}
