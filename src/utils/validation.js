export function isValidNumber(val) {
  if (val === null || val === undefined || val === '') return false;
  return !isNaN(Number(val)) && Number(val) >= 0;
}
