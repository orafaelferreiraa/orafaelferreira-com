#!/usr/bin/env node
/**
 * sync-talks-and-events.mjs
 *
 * Automacao de build-time:
 *  1. Le src/components/Talks.tsx e move toda talk de `upcomingTalks` cuja
 *     `date` (YYYY-MM-DD) seja <= hoje (America/Sao_Paulo) para:
 *       - `onlineTalks`   se location === "Online"
 *       - `inPersonTalks` caso contrario
 *  2. Le todas as talks de inPersonTalks + onlineTalks pertencentes ao ano
 *     corrente e regenera o bloco AUTO da "Agenda <ano>" no artigo
 *     src/data/articles/2023-10-30-eventos.ts, preservando o bloco MANUAL.
 *
 * Caracteristicas:
 *  - Idempotente: se nao houver mudanca de estado, nao escreve diff.
 *  - Determinista: ordenacao por data desc.
 *  - Sem dependencia externa: parser de TS por balanceamento de chaves
 *    com awareness de strings/template literals/comentarios.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const TALKS_FILE = path.join(projectRoot, 'src', 'components', 'Talks.tsx');
const EVENTS_FILE = path.join(projectRoot, 'src', 'data', 'articles', '2023-10-30-eventos.ts');

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function todayInSaoPaulo() {
  // Override opcional via env var (uso em testes/CI dry-run)
  const override = process.env.SYNC_TODAY;
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) {
    return override;
  }
  // en-CA produz YYYY-MM-DD nativamente
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(new Date());
}

/**
 * Acha `const NAME: Talk[] = [ ... ];` e retorna {arrayStart, arrayEnd}
 * onde arrayStart aponta para o '[' e arrayEnd aponta para o ']'
 * correspondente (inclusivo).
 */
function findArrayLiteral(source, name) {
  const declRe = new RegExp(`const\\s+${name}\\s*:\\s*Talk\\[\\]\\s*=\\s*\\[`, 'm');
  const m = declRe.exec(source);
  if (!m) {
    throw new Error(`Declaracao nao encontrada: ${name}`);
  }
  const arrayStart = m.index + m[0].length - 1; // posicao do '['
  let depth = 0;
  let inStr = null;
  let inLineComment = false;
  let inBlockComment = false;
  for (let i = arrayStart; i < source.length; i++) {
    const ch = source[i];
    const nx = source[i + 1];
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && nx === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (inStr) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '/' && nx === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (ch === '/' && nx === '*') {
      inBlockComment = true;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch;
      continue;
    }
    if (ch === '[' || ch === '{') depth++;
    else if (ch === ']' || ch === '}') {
      depth--;
      if (depth === 0 && ch === ']') {
        return { arrayStart, arrayEnd: i };
      }
    }
  }
  throw new Error(`Array nao balanceado em ${name}`);
}

/**
 * Dado o body interno do array (sem os colchetes), separa cada elemento
 * top-level (assumindo objetos `{ ... }` separados por virgula).
 * Retorna lista de { text } com o conteudo de cada `{...}`.
 */
function splitElements(body) {
  const elements = [];
  let depth = 0;
  let inStr = null;
  let inLineComment = false;
  let inBlockComment = false;
  let elemStart = -1;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    const nx = body[i + 1];
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && nx === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (inStr) {
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '/' && nx === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (ch === '/' && nx === '*') {
      inBlockComment = true;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch;
      continue;
    }
    if (depth === 0 && ch === '{') {
      elemStart = i;
      depth++;
      continue;
    }
    if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') {
      depth--;
      if (depth === 0 && elemStart >= 0) {
        elements.push({ text: body.slice(elemStart, i + 1) });
        elemStart = -1;
      }
    }
  }
  return elements;
}

function getStringField(elemText, field) {
  const re = new RegExp(`\\b${field}\\s*:\\s*(?:"((?:[^"\\\\]|\\\\.)*)"|'((?:[^'\\\\]|\\\\.)*)')`, 'm');
  const m = re.exec(elemText);
  if (!m) return undefined;
  return m[1] ?? m[2];
}

/**
 * Reconstroi o conteudo de um array de Talks com formatacao consistente.
 * Recebe lista de elementos { text } e retorna string completa entre
 * '[' e ']' inclusivos.
 */
function rebuildArrayLiteral(elements, { indent = '    ' } = {}) {
  if (elements.length === 0) {
    return '[]';
  }
  const body = elements
    .map((e) => indent + e.text.replace(/\n/g, '\n')) // texto ja tem proprias quebras
    .join(',\n');
  return `[\n${body},\n  ]`;
}

function sortByDateDesc(elements) {
  return [...elements].sort((a, b) => {
    const da = getStringField(a.text, 'date') || '';
    const db = getStringField(b.text, 'date') || '';
    return db.localeCompare(da);
  });
}

async function syncTalks(today) {
  const original = await readFile(TALKS_FILE, 'utf-8');

  const upcomingPos = findArrayLiteral(original, 'upcomingTalks');
  const inPersonPos = findArrayLiteral(original, 'inPersonTalks');
  const onlinePos = findArrayLiteral(original, 'onlineTalks');

  const upBody = original.slice(upcomingPos.arrayStart + 1, upcomingPos.arrayEnd);
  const upcomingElems = splitElements(upBody);

  // Se não há upcomingTalks, não faz nada
  if (upcomingElems.length === 0) {
    console.log(`[sync-talks] Nenhum upcoming talk. Nada a fazer.`);
    return original;
  }

  // Pega o próximo (primeiro) upcoming
  const nextUpcoming = upcomingElems[0];
  const nextDate = getStringField(nextUpcoming.text, 'date');

  // Se o próximo evento NÃO é hoje, não faz nada (retorna early)
  if (nextDate !== today) {
    console.log(`[sync-talks] Próximo evento: ${nextDate} (hoje é ${today}). Nada a fazer.`);
    return original;
  }

  // Próximo evento é hoje! Processa movimentação
  console.log(`[sync-talks] Próximo evento é HOJE (${today})! Movendo talks vencidas...`);

  const expired = [];
  const remaining = [];
  for (const el of upcomingElems) {
    const date = getStringField(el.text, 'date');
    if (date && date <= today) expired.push(el);
    else remaining.push(el);
  }

  if (expired.length === 0) {
    console.log(`[sync-talks] Nenhuma talk vencida.`);
    return original;
  }

  const inPersonBody = original.slice(inPersonPos.arrayStart + 1, inPersonPos.arrayEnd);
  const onlineBody = original.slice(onlinePos.arrayStart + 1, onlinePos.arrayEnd);
  const inPersonElems = splitElements(inPersonBody);
  const onlineElems = splitElements(onlineBody);

  const movedSummary = [];
  for (const el of expired) {
    const loc = (getStringField(el.text, 'location') || '').trim();
    const date = getStringField(el.text, 'date');
    const event = getStringField(el.text, 'event');
    if (/^online$/i.test(loc)) {
      onlineElems.push(el);
      movedSummary.push(`online <- ${date} ${event}`);
    } else {
      inPersonElems.push(el);
      movedSummary.push(`presencial <- ${date} ${event}`);
    }
  }

  const newUpcoming = rebuildArrayLiteral(sortByDateDesc(remaining));
  const newInPerson = rebuildArrayLiteral(sortByDateDesc(inPersonElems));
  const newOnline = rebuildArrayLiteral(sortByDateDesc(onlineElems));

  // Aplica do maior offset para o menor para preservar indices
  const replacements = [
    { start: upcomingPos.arrayStart, end: upcomingPos.arrayEnd, text: newUpcoming },
    { start: inPersonPos.arrayStart, end: inPersonPos.arrayEnd, text: newInPerson },
    { start: onlinePos.arrayStart, end: onlinePos.arrayEnd, text: newOnline },
  ].sort((a, b) => b.start - a.start);

  let updated = original;
  for (const r of replacements) {
    updated = updated.slice(0, r.start) + r.text + updated.slice(r.end + 1);
  }

  if (updated !== original) {
    await writeFile(TALKS_FILE, updated, 'utf-8');
    console.log(`[sync-talks] ✅ Movidas ${expired.length} talk(s):`);
    for (const line of movedSummary) console.log(`  - ${line}`);
  }
  return updated;
}

/**
 * Coleta talks de inPersonTalks + onlineTalks pertencentes ao ano alvo.
 * Apenas talks com date <= today entram no bloco automatico (mesma regra
 * usada para "saiu de Incoming").
 */
function collectAutoEventsForYear(talksSource, year, today) {
  const inPersonPos = findArrayLiteral(talksSource, 'inPersonTalks');
  const onlinePos = findArrayLiteral(talksSource, 'onlineTalks');
  const elems = [
    ...splitElements(talksSource.slice(inPersonPos.arrayStart + 1, inPersonPos.arrayEnd)),
    ...splitElements(talksSource.slice(onlinePos.arrayStart + 1, onlinePos.arrayEnd)),
  ];
  const yearStr = String(year);
  const result = [];
  for (const el of elems) {
    const date = getStringField(el.text, 'date');
    if (!date || !date.startsWith(yearStr + '-')) continue;
    if (date > today) continue;
    const event = getStringField(el.text, 'event') || '';
    const siteUrl = getStringField(el.text, 'siteUrl');
    const linkedinUrl = getStringField(el.text, 'linkedinUrl');
    const url = siteUrl || linkedinUrl || '#';
    const monthIdx = parseInt(date.slice(5, 7), 10) - 1;
    const monthLabel = MONTHS_PT[monthIdx] || '???';
    result.push({ date, monthLabel, event, url });
  }
  // ordenacao desc por data para manter mais proximo primeiro (Abr -> Fev -> Jan)
  result.sort((a, b) => b.date.localeCompare(a.date));
  return result;
}

function buildAutoBlockMarkdown(events, year) {
  const start = `<!-- AUTO-EVENTS:START:${year} -->`;
  const end = `<!-- AUTO-EVENTS:END:${year} -->`;
  const header = '| Mês | Evento |\n|-----|--------|';
  const rows = events.map((e) => `| ${e.monthLabel} | [**${e.event}**](${e.url}) |`).join('\n');
  const body = rows ? `${header}\n${rows}` : header;
  return `${start}\n${body}\n${end}`;
}

async function syncEventsArticle(talksSource, year, today) {
  const original = await readFile(EVENTS_FILE, 'utf-8');
  const startTag = `<!-- AUTO-EVENTS:START:${year} -->`;
  const endTag = `<!-- AUTO-EVENTS:END:${year} -->`;
  const startIdx = original.indexOf(startTag);
  const endIdx = original.indexOf(endTag);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    console.warn(
      `[sync-events] Delimitadores AUTO-EVENTS:${year} nao encontrados em ${path.basename(EVENTS_FILE)}. Pulando.`,
    );
    return;
  }
  const events = collectAutoEventsForYear(talksSource, year, today);
  const newBlock = buildAutoBlockMarkdown(events, year);
  const updated =
    original.slice(0, startIdx) + newBlock + original.slice(endIdx + endTag.length);
  if (updated !== original) {
    await writeFile(EVENTS_FILE, updated, 'utf-8');
    console.log(`[sync-events] Bloco AUTO-EVENTS:${year} atualizado (${events.length} linha(s)).`);
  } else {
    console.log(`[sync-events] Bloco AUTO-EVENTS:${year} ja estava atualizado.`);
  }
}

async function main() {
  const today = todayInSaoPaulo();
  const year = parseInt(today.slice(0, 4), 10);
  console.log(`[sync] Hoje (America/Sao_Paulo) = ${today}, ano alvo = ${year}`);
  const talksSource = await syncTalks(today);
  await syncEventsArticle(talksSource, year, today);
}

main().catch((err) => {
  console.error('[sync] Falha:', err);
  process.exitCode = 1;
});
