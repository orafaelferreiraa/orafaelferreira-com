#!/usr/bin/env node

/**
 * Gerador de Páginas Estáticas para Artigos
 * Cria arquivos HTML pré-renderizados com meta tags OG para cada artigo
 * Esses arquivos são servidos APENAS para crawlers (LinkedIn, WhatsApp, Twitter, etc)
 * Usuários reais são redirecionados para a SPA pelo SWA config baseado em User-Agent
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function extractFirstImage(content) {
  const markdownImageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)[^)]*\)/;
  const match = content.match(markdownImageRegex);
  return match ? match[1] : null;
}

function extractArticleData(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  try {
    const startIdx = content.indexOf('export const article: Article = {');
    if (startIdx === -1) return null;
    
    const afterExport = content.substring(startIdx + 33);
    
    const slugMatch = afterExport.match(/slug:\s*"([^"]+)"/);
    const slug = slugMatch ? slugMatch[1] : null;
    
    const titleMatch = afterExport.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : null;
    
    const excerptMatch = afterExport.match(/excerpt:\s*"([^"]+)"/);
    const excerpt = excerptMatch ? excerptMatch[1] : null;
    
    const imageMatch = afterExport.match(/image:\s*"([^"]+)"/);
    const image = imageMatch ? imageMatch[1] : null;
    
    const dateMatch = afterExport.match(/date:\s*"([^"]+)"/);
    const date = dateMatch ? dateMatch[1] : null;
    
    const categoryMatch = afterExport.match(/category:\s*"([^"]+)"/);
    const category = categoryMatch ? categoryMatch[1] : null;
    
    const contentStartIdx = afterExport.indexOf('content: `');
    const contentEndIdx = afterExport.indexOf('`,', contentStartIdx);
    const contentStr = contentStartIdx !== -1 && contentEndIdx !== -1 
      ? afterExport.substring(contentStartIdx + 10, contentEndIdx)
      : '';
    
    const finalImage = image || extractFirstImage(contentStr);
    
    return {
      slug,
      title,
      excerpt,
      image: finalImage,
      date,
      category,
      url: `https://www.orafaelferreira.com/artigos/${slug}`
    };
  } catch (e) {
    console.warn('Erro ao extrair dados:', e.message);
    return null;
  }
}

// Ler todos os artigos
const articlesDir = path.join(__dirname, 'src/data/articles');
const articles = [];

fs.readdirSync(articlesDir)
  .filter(file => file.endsWith('.ts') && file !== 'types.ts' && file !== 'index.ts')
  .forEach(file => {
    const filePath = path.join(articlesDir, file);
    const data = extractArticleData(filePath);
    
    if (data && data.slug) {
      articles.push(data);
    }
  });

// Ler template do index.html
const indexPath = path.join(__dirname, 'index.html');
let indexTemplate = fs.readFileSync(indexPath, 'utf8');

// Criar diretório de artigos no public
const publicArticlesDir = path.join(__dirname, 'public/artigos');
if (!fs.existsSync(publicArticlesDir)) {
  fs.mkdirSync(publicArticlesDir, { recursive: true });
}

// Gerar arquivo HTML para cada artigo
articles.forEach(article => {
  let html = indexTemplate;
  
  const escapeHtml = (str) => {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const title = escapeHtml(article.title);
  const description = escapeHtml(article.excerpt);
  const image = article.image || '';
  const url = `https://www.orafaelferreira.com/artigos/${article.slug}`;
  const date = article.date;
  const category = escapeHtml(article.category);

  // Construir meta tags
  const metaTags = `
    <!-- Meta Tags do Artigo: ${article.slug} -->
    <meta property="og:title" content="${title} - Rafael Martin" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    ${image ? `<meta property="og:image" content="${image}" />` : ''}
    ${image ? `<meta property="og:image:width" content="1200" />` : ''}
    ${image ? `<meta property="og:image:height" content="630" />` : ''}
    ${image ? `<meta property="og:image:alt" content="${title}" />` : ''}
    <meta property="og:site_name" content="Rafael Martin - DevOps | Cloud | FinOps" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title} - Rafael Martin" />
    <meta name="twitter:description" content="${description}" />
    ${image ? `<meta name="twitter:image" content="${image}" />` : ''}
    <meta name="twitter:creator" content="@orafaelferreira" />
    
    <!-- Article Metadata -->
    <meta property="article:published_time" content="${date}" />
    <meta property="article:author" content="Rafael Martin" />
    <meta property="article:section" content="${category}" />
    
    <!-- Meta padrão -->
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
  `;
  
  // Inserir meta tags antes de </head>
  html = html.replace('</head>', metaTags + '\n  </head>');
  
  // Remover script de Vite (não funciona em arquivo estático)
  html = html.split('<script type="module" src="/src/main.tsx"></script>').join('');
  
  // NÃO adicionar redirect script - deixar o SWA config detectar user-agent
  // Crawlers vão pegar os meta tags daqui
  // Usuários reais serão redirecionados pelo SWA baseado em User-Agent
  
  // Salvar arquivo
  const filePath = path.join(publicArticlesDir, `${article.slug}.html`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✅ artigos/${article.slug}.html`);
});

console.log(`\n✨ ${articles.length} artigos pré-renderizados com meta tags!`);