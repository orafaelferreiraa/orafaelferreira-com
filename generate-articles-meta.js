/**
 * Gerador de Meta Tags para Artigos
 * Cria um arquivo JSON com metadados para cada artigo
 * Esse arquivo é usado pelo servidor para injetar meta tags corretas
 */

const fs = require('fs');
const path = require('path');

function extractFirstImage(content) {
  const markdownImageRegex = /!\[.*?\]\((https?:\/\/[^\s)]+)[^)]*\)/;
  const match = content.match(markdownImageRegex);
  return match ? match[1] : null;
}

function extractArticleData(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Parse do objeto article
  try {
    // Extrair o conteúdo entre { }
    const startIdx = content.indexOf('export const article: Article = {');
    if (startIdx === -1) return null;
    
    const afterExport = content.substring(startIdx + 33);
    
    // Extrair slug
    const slugMatch = afterExport.match(/slug:\s*"([^"]+)"/);
    const slug = slugMatch ? slugMatch[1] : null;
    
    // Extrair title
    const titleMatch = afterExport.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : null;
    
    // Extrair excerpt
    const excerptMatch = afterExport.match(/excerpt:\s*"([^"]+)"/);
    const excerpt = excerptMatch ? excerptMatch[1] : null;
    
    // Extrair image
    const imageMatch = afterExport.match(/image:\s*"([^"]+)"/);
    const image = imageMatch ? imageMatch[1] : null;
    
    // Extrair date
    const dateMatch = afterExport.match(/date:\s*"([^"]+)"/);
    const date = dateMatch ? dateMatch[1] : null;
    
    // Extrair category
    const categoryMatch = afterExport.match(/category:\s*"([^"]+)"/);
    const category = categoryMatch ? categoryMatch[1] : null;
    
    // Extrair content para buscar primeira imagem se não houver image explícito
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
const articlesMeta = {};

fs.readdirSync(articlesDir)
  .filter(file => file.endsWith('.ts') && file !== 'types.ts' && file !== 'index.ts')
  .forEach(file => {
    const filePath = path.join(articlesDir, file);
    const data = extractArticleData(filePath);
    
    if (data && data.slug) {
      articlesMeta[data.slug] = data;
      console.log(`✅ ${data.slug}`);
    }
  });

// Salvar em arquivo público para ser servido
const outputPath = path.join(__dirname, 'public/articles-meta.json');
fs.writeFileSync(outputPath, JSON.stringify(articlesMeta, null, 2), 'utf8');

console.log(`\n✨ ${Object.keys(articlesMeta).length} artigos mapeados em public/articles-meta.json`);
