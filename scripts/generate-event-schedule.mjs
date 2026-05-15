#!/usr/bin/env node
/**
 * Gera entradas de cron específicas para cada data de evento futuro
 * em upcomingTalks (src/components/Talks.tsx) e atualiza o workflow
 * .github/workflows/sync-talks-on-event-day.yml entre os marcadores
 * AUTO-CRON:START / AUTO-CRON:END.
 *
 * Filosofia: a pipeline NUNCA roda em dias sem evento. Cada evento
 * agenda exatamente UM disparo (no próprio dia do evento, 08:05 BRT).
 *
 * Idempotente: se o conjunto de crons não mudou, não reescreve o arquivo.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TALKS_FILE = resolve(ROOT, 'src/components/Talks.tsx');
const WORKFLOW_FILE = resolve(ROOT, '.github/workflows/sync-talks-on-event-day.yml');

const START_MARK = '# AUTO-CRON:START';
const END_MARK = '# AUTO-CRON:END';

function todayInSaoPaulo() {
  if (process.env.SCHEDULE_TODAY) return process.env.SCHEDULE_TODAY;
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  return fmt.format(new Date());
}

/** Localiza o array literal `const <name>: ... = [ ... ];` */
function findArrayLiteral(source, name) {
  const re = new RegExp(`const\\s+${name}\\s*:[^=]*=\\s*\\[`);
  const m = re.exec(source);
  if (!m) throw new Error(`Array ${name} não encontrado em Talks.tsx`);
  const arrayStart = m.index + m[0].length - 1;
  let depth = 0;
  let i = arrayStart;
  let inStr = null;
  for (; i < source.length; i++) {
    const c = source[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) break; }
  }
  return { start: arrayStart, end: i };
}

function extractUpcomingDates(source) {
  const { start, end } = findArrayLiteral(source, 'upcomingTalks');
  const body = source.slice(start + 1, end);
  const dates = [];
  const re = /date\s*:\s*"(\d{4}-\d{2}-\d{2})"/g;
  let m;
  while ((m = re.exec(body)) !== null) dates.push(m[1]);
  return dates;
}

/**
 * Converte "YYYY-MM-DD" em uma linha cron que dispara nesse dia
 * às 11:05 UTC (08:05 BRT). Cron do GitHub não suporta ano: o script
 * de sync sempre verifica `date === today` e sai cedo se não bater,
 * então qualquer disparo "fantasma" no mesmo dia/mês de outro ano
 * custa apenas alguns segundos.
 */
function dateToCron(isoDate) {
  const [, mm, dd] = isoDate.split('-');
  const month = parseInt(mm, 10);
  const day = parseInt(dd, 10);
  return `'5 11 ${day} ${month} *'`;
}

function buildAutoBlock(dates) {
  if (dates.length === 0) {
    return `${START_MARK}\n    # (nenhum evento futuro em upcomingTalks)\n    ${END_MARK}`;
  }
  const lines = dates.map((d) => `    - cron: ${dateToCron(d)}  # ${d}`);
  return `${START_MARK}\n${lines.join('\n')}\n    ${END_MARK}`;
}

async function main() {
  const today = todayInSaoPaulo();
  console.log(`[schedule] Hoje (America/Sao_Paulo) = ${today}`);

  const talksSrc = await readFile(TALKS_FILE, 'utf-8');
  const allDates = extractUpcomingDates(talksSrc);
  const futureDates = [...new Set(allDates)]
    .filter((d) => d >= today)
    .sort();

  console.log(`[schedule] upcomingTalks futuras: ${futureDates.length}`);
  for (const d of futureDates) console.log(`  - ${d}`);

  const wf = await readFile(WORKFLOW_FILE, 'utf-8');
  const startIdx = wf.indexOf(START_MARK);
  const endIdx = wf.indexOf(END_MARK);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(`Marcadores ${START_MARK}/${END_MARK} não encontrados em ${WORKFLOW_FILE}`);
  }
  const before = wf.slice(0, startIdx);
  const after = wf.slice(endIdx + END_MARK.length);
  const block = buildAutoBlock(futureDates);
  const next = `${before}${block}${after}`;

  if (next === wf) {
    console.log('[schedule] Nenhuma mudança no cron. Nada a fazer.');
    return;
  }
  await writeFile(WORKFLOW_FILE, next, 'utf-8');
  console.log('[schedule] ✅ Workflow cron atualizado.');
}

main().catch((err) => {
  console.error('[schedule] ERRO:', err);
  process.exit(1);
});
