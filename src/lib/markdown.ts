/**
 * Converte markdown para HTML - Solução nativa sem dependências
 */

export function markdownToHtml(markdown: string): string {
  let html = markdown;

  // 1. Blocos de código (processar PRIMEIRO antes de código inline)
  html = html.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const escaped = code.trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const language = lang || 'code';
    return `<div class="relative my-6 group"><div class="bg-slate-800 px-4 py-2 text-xs text-slate-300 rounded-t-lg font-mono">${language}</div><pre class="bg-slate-900 dark:bg-slate-950 p-4 rounded-b-lg overflow-x-auto"><code class="text-sm text-slate-100 font-mono block whitespace-pre">${escaped}</code></pre><button onclick="navigator.clipboard.writeText(this.parentElement.querySelector('code').textContent)" class="absolute top-10 right-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">Copiar</button></div>`;
  });

  // 2. Casos especiais: Imagem dentro de link [![alt](img)](href "title")
  // Converte em <a><img/></a> preservando título opcional do link
  html = html.replace(/\[!\[(.*?)\]\((\S+?)(?:\s+(".*?"|'.*?'|\(.*?\)))?\)\]\((https?:\/\/\S+?)(?:\s+(".*?"|'.*?'|\(.*?\)))?\)/g,
    '<a href="$4" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium"><img src="$2" alt="$1" class="w-full rounded-lg my-6 shadow-md" loading="lazy" /></a>'
  );

  // 3. Imagens (suporta título opcional em imagens)
  // Padrão: ![alt](url "title") ou ![alt](url 'title') ou ![alt](url (title))
  html = html.replace(/!\[(.*?)\]\((\S+?)(?:\s+(".*?"|'.*?'|\(.*?\)))?\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg my-6 shadow-md" loading="lazy" />');

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
    table += '<thead class="bg-slate-100 dark:bg-slate-800"><tr>';
    headers.forEach((h: string) => {
      table += `<th class="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left font-semibold">${h}</th>`;
    });
    table += '</tr></thead><tbody class="bg-white dark:bg-slate-900">';
    rowsArray.forEach((row: string[]) => {
      table += '<tr class="hover:bg-slate-50 dark:hover:bg-slate-800">';
      row.forEach((cell: string) => {
        table += `<td class="border border-slate-300 dark:border-slate-600 px-4 py-2">${cell}</td>`;
      });
      table += '</tr>';
    });
    table += '</tbody></table></div>';
    return table;
  });

  // 6. Títulos (ordem importante: #### antes de ### antes de ##)
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-lg font-bold mt-5 mb-2 text-primary">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>');

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

  // 10. Parágrafos (processar por último)
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed === '') return '';
    if (trimmed.startsWith('<')) return line;
    if (trimmed.match(/^#{1,4} /)) return line;
    return `<p class="mb-4 leading-relaxed">${line}</p>`;
  }).join('\n');

  return html;
}
