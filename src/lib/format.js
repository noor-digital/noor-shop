// Formatters shared across the app.

// Groups thousands with a narrow no-break space, no decimals.
// We append the "F CFA" suffix ourselves so the output is stable across
// ICU versions (older ICU returns "14 900 CFA", newer "14 900 F CFA").
const XOF_NUMBER = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
  useGrouping: true,
});

export const formatXof = (value) => {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) return '—';
  return `${XOF_NUMBER.format(Number(value))} F CFA`;
};

export const formatNumber = (value) =>
  new Intl.NumberFormat('fr-FR').format(Number(value ?? 0));

export const formatDate = (value) => {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const classNames = (...values) => values.filter(Boolean).join(' ');

export const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
