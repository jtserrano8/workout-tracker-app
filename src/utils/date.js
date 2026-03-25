export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}
