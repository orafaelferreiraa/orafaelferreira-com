#!/usr/bin/env node

/**
 * Script de Prerendering para Artigos
 * Gera HTML pré-renderizado com meta tags OG para cada artigo
 * Execute: node prerender-articles.js
 */

const fs = require('fs');
const path = require('path');

// Função para extrair primeira imagem do markdown
function extractFirstImage(content) {
  const markdownImageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)[^)]*\)/;
  const match = content.match(markdownImageRegex);
  return match ? match[1] : null;
}

// Ler todos os artigos
const articlesDir = path.join(__dirname, 'src/data/articles');
const articles = [];

// Ler cada arquivo de artigo
fs.readdirSync(articlesDir)
  .filter(file => file.endsWith('.ts') && file !== 'types.ts' && file !== 'index.ts')
  .forEach(file => {
    const filePath = path.join(articlesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Extrair apenas o objeto article usando regex
    const articleMatch = content.match(/export const article: Article = ({[\s\S]*});/);
    if (!articleMatch) return;
    
    try {
      // Usar eval é arriscado, mas aqui é apenas para dev
      const articleStr = articleMatch[1];
      // Converter para JSON válido
      const jsonStr = articleStr
        .replace(/`[\s\S]*?`/g, (match) => {
          // Escapar strings de template literals
          return JSON.stringify(match.slice(1, -1));
        });
      
      // Parser mais seguro
      const article = eval('(' + jsonStr + ')');
      articles.push(article);
    } catch (e) {
      console.warn(`Erro ao parsear ${file}:`, e.message);
    }
  });

console.log(`✅ Encontrados ${articles.length} artigos`);

// Ler template do index.html
const indexPath = path.join(__dirname, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Processar cada artigo
articles.forEach(article => {
  if (!article.slug) return;
  
  // Extrair imagem
  const image = article.image || extractFirstImage(article.content);
  
  // Criar HTML com meta tags
  let html = indexContent;
  
  // Adicionar meta tags específicas do artigo
  const metaTags = `
    <meta property="og:title" content="${article.title.replace(/"/g, '&quot;')} - Rafael Martin" />
    <meta property="og:description" content="${article.excerpt.replace(/"/g, '&quot;')}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://www.orafaelferreira.com/artigos/${article.slug}" />
    ${image ? `<meta property="og:image" content="${image}" />` : ''}
    ${image ? `<meta property="og:image:width" content="1200" />` : ''}
    ${image ? `<meta property="og:image:height" content="630" />` : ''}
    ${image ? `<meta property="og:image:alt" content="${article.title.replace(/"/g, '&quot;')}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${article.title.replace(/"/g, '&quot;')} - Rafael Martin" />
    <meta name="twitter:description" content="${article.excerpt.replace(/"/g, '&quot;')}" />
    ${image ? `<meta name="twitter:image" content="${image}" />` : ''}
    <meta property="article:published_time" content="${article.date}" />
    <meta property="article:author" content="Rafael Martin" />
    <meta property="article:section" content="${article.category}" />
    <link rel="canonical" href="https://www.orafaelferreira.com/artigos/${article.slug}" />
  `;
  
  // Inserir meta tags antes de </head>
  html = html.replace('</head>', metaTags + '</head>');
  
  // Criar diretório de destino
  const distDir = path.join(__dirname, 'dist/artigos');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Salvar arquivo HTML
  const filePath = path.join(distDir, `${article.slug}.html`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ Pré-renderizado: ${article.slug}`);
});

console.log('\n✨ Prerendering completo!');
