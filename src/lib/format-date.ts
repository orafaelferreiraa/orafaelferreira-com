/**
 * Deterministic date formatting for "YYYY-MM-DD" strings.
 *
 * Avoids `toLocaleDateString`, whose output can differ between the Node ICU used
 * by the build-time prerender and the visitor's browser, which would surface as
 * a hydration mismatch.
 */
const MONTHS_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function parts(iso: string): [number, number, number] | null {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** "2026-09-05" -> "5 de setembro de 2026" | "September 5, 2026" */
export function formatLongDate(iso: string, lang = 'pt-BR'): string {
  const p = parts(iso);
  if (!p) return iso;
  const [y, m, d] = p;
  if (lang.startsWith('pt')) return `${d} de ${MONTHS_PT[m - 1]} de ${y}`;
  return `${MONTHS_EN[m - 1]} ${d}, ${y}`;
}

/** "2026-09-05" -> "05/09/2026" | "09/05/2026" */
export function formatShortDate(iso: string, lang = 'pt-BR'): string {
  const p = parts(iso);
  if (!p) return iso;
  const [y, m, d] = p;
  const dd = String(d).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  return lang.startsWith('pt') ? `${dd}/${mm}/${y}` : `${mm}/${dd}/${y}`;
}
