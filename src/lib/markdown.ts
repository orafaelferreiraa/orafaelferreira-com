/**
 * Converte markdown para HTML - Solução nativa sem dependências
 */

export interface MarkdownHeading {
  /** 2 | 3 (h4 não entra no sumário) */
  level: number;
  text: string;
  id: string;
}

/**
 * Gera um id estável e legível para âncoras de heading (sumário / links diretos).
 */
export function slugifyHeading(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_~]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || 'secao';
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim();
}

/**
 * Extrai os headings h2/h3 do markdown (fora de blocos de código) para montar o
 * sumário. Um `# ` de nível 1 no corpo é tratado como h2 (o h1 da página é o título).
 * Os ids batem com os gerados por `markdownToHtml`.
 */
export function extractHeadings(markdown: string): MarkdownHeading[] {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '');
  const headings: MarkdownHeading[] = [];
  const seen = new Map<string, number>();

  for (const line of withoutCode.split('\n')) {
    const match = line.match(/^(#{1,3}) (.+?)\s*$/);
    if (!match) continue;
    const level = Math.max(2, match[1].length);
    const text = stripInlineMarkdown(match[2]);
    headings.push({ level, text, id: uniqueId(slugifyHeading(text), seen) });
  }

  return headings;
}

function uniqueId(base: string, seen: Map<string, number>): string {
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

export function markdownToHtml(markdown: string): string {
  let html = markdown;
  const codeBlocks: string[] = [];
  const headingIds = new Map<string, number>();
  let imageCount = 0;

  // 1. Blocos de código (processar PRIMEIRO antes de código inline)
  html = html.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const normalized = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const cleaned = normalized.endsWith('\n') ? normalized.slice(0, -1) : normalized;
    const escaped = cleaned
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const language = lang || 'code';
    const blockHtml = `<div class="relative my-6 group"><div class="bg-slate-800 px-4 py-2 text-xs text-slate-300 rounded-t-lg font-mono">${language}</div><pre class="bg-slate-900 dark:bg-slate-950 p-4 rounded-b-lg overflow-x-auto"><code class="text-sm text-slate-100 font-mono block whitespace-pre" style="line-height: 1.4;">${escaped}</code></pre><button onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').textContent)" class="absolute top-10 right-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">Copiar</button></div>`;
    const token = `@@CODE_BLOCK_${codeBlocks.length}@@`;
    codeBlocks.push(blockHtml);
    return token;
  });

  // Imagens: a primeira carrega eager (costuma ser a capa/LCP); as demais lazy.
  const imgAttrs = () => {
    imageCount += 1;
    return imageCount === 1
      ? 'loading="eager" decoding="async" fetchpriority="high"'
      : 'loading="lazy" decoding="async"';
  };

  // 2. Casos especiais: Imagem dentro de link [![alt](img)](href "title")
  // Converte em <a><img/></a> preservando título opcional do link
  html = html.replace(/\[!\[(.*?)\]\((\S+?)(?:\s+(".*?"|'.*?'|\(.*?\)))?\)\]\((https?:\/\/\S+?)(?:\s+(".*?"|'.*?'|\(.*?\)))?\)/g,
    (_, alt, src, _imgTitle, href) =>
      `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium"><img src="${src}" alt="${alt}" class="w-full rounded-lg my-6 shadow-md" ${imgAttrs()} /></a>`
  );

  // 3. Imagens (suporta título opcional em imagens)
  // Padrão: ![alt](url "title") ou ![alt](url 'title') ou ![alt](url (title))
  html = html.replace(/!\[(.*?)\]\((\S+?)(?:\s+(".*?"|'.*?'|\(.*?\)))?\)/g,
    (_, alt, src) => `<img src="${src}" alt="${alt}" class="w-full rounded-lg my-6 shadow-md" ${imgAttrs()} />`
  );

  // 4. Links (externos e internos) com suporte a título opcional
  // Externos: [text](https://url "title") aceita título com aspas simples/duplas ou parênteses
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/\S+?)(?:\s+(".*?"|'.*?'|\(.*?\)))?\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">$1</a>');
  // Internos: [text](/rota) (sem título opcional por simplicidade)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline font-medium">$1</a>');

  // 5. Tabelas
  html = html.replace(/\n(\|.+\|)\n(\|[\s:|-]+\|)\n((?:\|.+\|\n?)+)/g, (_, header, sep, rows) => {
    const headers = header.split('|').filter((h: string) => h.trim()).map((h: string) => h.trim());
    const rowsArray = rows.trim().split('\n').map((row: string) =>
      row.split('|').filter((c: string) => c.trim()).map((c: string) => c.trim())
    );

    let table = '<div class="overflow-x-auto my-6"><table class="min-w-full border-collapse border border-slate-300 dark:border-slate-600">';
    table += '<thead class="bg-slate-800 dark:bg-slate-800"><tr>';
    headers.forEach((h: string) => {
      table += `<th class="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left font-semibold">${h}</th>`;
    });
    table += '</tr></thead><tbody class="bg-slate-900 dark:bg-slate-900">';
    rowsArray.forEach((row: string[]) => {
      table += '<tr class="hover:bg-slate-800 dark:hover:bg-slate-800">';
      row.forEach((cell: string) => {
        table += `<td class="border border-slate-300 dark:border-slate-600 px-4 py-2">${cell}</td>`;
      });
      table += '</tr>';
    });
    table += '</tbody></table></div>';
    return table;
  });

  // 6. Títulos (ordem importante: #### antes de ### antes de ##).
  // O h1 da página é o título do artigo, então um `# ` no corpo vira h2 para
  // manter um único h1 por página. h2/h3 recebem id para âncoras do sumário.
  const heading = (level: 2 | 3, text: string, classes: string) => {
    const id = uniqueId(slugifyHeading(stripInlineMarkdown(text)), headingIds);
    return `<h${level} id="${id}" class="${classes} scroll-mt-24">${text}</h${level}>`;
  };
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold mt-5 mb-2 text-primary">$1</h4>');
  html = html.replace(/^### (.*)$/gim, (_, text) => heading(3, text, 'text-xl font-bold mt-6 mb-3'));
  html = html.replace(/^## (.*)$/gim, (_, text) => heading(2, text, 'text-2xl font-bold mt-8 mb-4'));
  html = html.replace(/^# (.*)$/gim, (_, text) => heading(2, text, 'text-2xl font-bold mt-8 mb-4'));

  // 7. Negrito e itálico
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 8. Código inline (depois dos blocos)
  html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-sm font-mono">$1</code>');

  // 9. Listas
  const lines = html.split('\n');
  const processed: string[] = [];
  let inList = false;

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.match(/^[-*] /)) {
      if (!inList) {
        processed.push('<ul class="list-disc list-inside space-y-2 my-4 ml-4">');
        inList = true;
      }
      processed.push(`<li>${trimmed.replace(/^[-*] /, '')}</li>`);
    } else {
      if (inList) {
        processed.push('</ul>');
        inList = false;
      }
      processed.push(line);
    }
  });

  if (inList) {
    processed.push('</ul>');
  }

  html = processed.join('\n');

  // 10. Parágrafos (processar por último) — proteger tokens de code block
  const linesForParagraph = html.split('\n');
  const processedParagraphs: string[] = [];
  linesForParagraph.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed === '') { processedParagraphs.push(''); return; }
    // Não envolver tokens nem linhas que já começam com elementos HTML
    if (trimmed.startsWith('@@CODE_BLOCK_')) { processedParagraphs.push(line); return; }
    if (trimmed.startsWith('<')) { processedParagraphs.push(line); return; }
    if (trimmed.match(/^#{1,4} /)) { processedParagraphs.push(line); return; }
    processedParagraphs.push(`<p class="mb-4 leading-relaxed">${line}</p>`);
  });
  html = processedParagraphs.join('\n');

  // Restaurar code blocks
  codeBlocks.forEach((blockHtml, i) => {
    const token = `@@CODE_BLOCK_${i}@@`;
    html = html.replace(token, blockHtml);
  });

  return html;
}

/**
 * Texto puro do markdown (sem código, imagens, links ou marcação), usado para
 * contagem de palavras (schema.org wordCount) e para o llms-full.txt.
 */
export function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`~|-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function countWords(markdown: string): number {
  const text = markdownToPlainText(markdown);
  return text ? text.split(' ').length : 0;
}
