/**
 * Script para converter conteúdo markdown dos artigos para HTML
 * Execute: node convert-markdown-to-html.js
 */

const fs = require('fs');
const path = require('path');

// Função para converter markdown básico para HTML
function markdownToHtml(markdown) {
  let html = markdown;

  // Imagens: ![alt](url) -> <img>
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg my-6 shadow-md" loading="lazy" />');

  // Links: [text](url) -> <a>
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
  html = html.replace(/\[([^\]]+)\]\(([^h][^\)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');

  // Títulos
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>');

  // Negrito: **text** -> <strong>
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Código inline: `code` -> <code>
  html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-muted rounded text-sm">$1</code>');

  // Blocos de código: ```lang\ncode\n``` -> <pre><code>
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
    return `<pre class="bg-slate-900 dark:bg-slate-950 p-4 rounded-lg overflow-x-auto my-6"><code class="text-sm text-slate-100">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Tabelas simples | col | col | -> <table>
  html = html.replace(/\n(\|.+\|)\n(\|[\s:|-]+\|)\n((?:\|.+\|\n?)+)/g, function(match, header, separator, rows) {
    const headers = header.split('|').filter(h => h.trim()).map(h => h.trim());
    const rowsArray = rows.trim().split('\n').map(row => 
      row.split('|').filter(c => c.trim()).map(c => c.trim())
    );
    
    let table = '<table class="min-w-full border-collapse border border-slate-400 dark:border-slate-700 my-6">';
    table += '<thead class="bg-slate-100 dark:bg-slate-800"><tr>';
    headers.forEach(h => {
      table += `<th class="border border-slate-300 dark:border-slate-600 px-4 py-2 text-left">${h}</th>`;
    });
    table += '</tr></thead><tbody>';
    rowsArray.forEach(row => {
      table += '<tr>';
      row.forEach(cell => {
        table += `<td class="border border-slate-300 dark:border-slate-600 px-4 py-2">${cell}</td>`;
      });
      table += '</tr>';
    });
    table += '</tbody></table>';
    return table;
  });

  // Listas não ordenadas: - item -> <ul><li>
  html = html.replace(/^[\-\*] (.+)$/gim, '<li class="ml-6 mb-2">$1</li>');
  html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>\n)+/g, '<ul class="list-disc mb-4">$&</ul>');

  // Listas ordenadas: 1. item -> <ol><li>
  html = html.replace(/^\d+\. (.+)$/gim, '<li class="ml-6 mb-2">$1</li>');

  // Parágrafos: linhas não vazias sem tags -> <p>
  html = html.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed === '') return '<br/>';
    if (trimmed.startsWith('<')) return line; // Já é HTML
    if (trimmed.match(/^#{1,3} /)) return line; // É título
    return `<p class="mb-4 leading-relaxed">${line}</p>`;
  }).join('\n');

  return html;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Processar todos os arquivos de artigos
const articlesDir = path.join(__dirname, 'src', 'data', 'articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.ts') && !f.includes('index') && !f.includes('types'));

console.log(`📝 Convertendo ${files.length} artigos...\n`);

files.forEach(file => {
  const filePath = path.join(articlesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extrair o conteúdo markdown entre os backticks
  const contentMatch = content.match(/content: `([\s\S]*?)`,\n  date:/);
  
  if (contentMatch) {
    const markdownContent = contentMatch[1];
    const htmlContent = markdownToHtml(markdownContent);
    
    // Substituir o conteúdo
    content = content.replace(
      /content: `[\s\S]*?`,\n  date:/,
      `content: \`${htmlContent}\`,\n  date:`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️  ${file} - não foi possível extrair conteúdo`);
  }
});

console.log(`\n✨ Conversão concluída!`);
console.log(`\n📋 Próximos passos:`);
console.log(`1. Executar: npm run build`);
console.log(`2. Executar: npm run dev`);
console.log(`3. Testar os artigos no navegador\n`);
