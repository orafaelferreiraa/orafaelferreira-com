/**
 * Script para gerar arquivos individuais de artigos a partir do articles.ts
 * 
 * Como usar:
 * 1. Certifique-se de que Node.js está instalado
 * 2. Execute: node generate-articles.js
 * 
 * Este script irá:
 * - Ler todos os artigos de articles.ts
 * - Criar um arquivo .ts individual para cada artigo no formato YYYY-MM-DD-slug.ts
 * - Atualizar o index.ts com todos os imports
 */

const fs = require('fs');
const path = require('path');

// Leia o arquivo articles.ts original
const articlesPath = path.join(__dirname, 'articles.ts');
const articlesContent = fs.readFileSync(articlesPath, 'utf8');

// Parse do conteúdo (método simples - em produção usaria um parser TypeScript apropriado)
// Extrai o array de artigos
const articleArrayMatch = articlesContent.match(/export const articles: Article\[\] = \[([\s\S]*)\];/);

if (!articleArrayMatch) {
  console.error('Não foi possível encontrar o array de artigos');
  process.exit(1);
}

// Parse os artigos individuais (método simplificado)
const articlesString = articleArrayMatch[1];
const articleObjects = eval(`[${articlesString}]`); // NOTA: Em produção, use um parser apropriado

const articleDir = path.join(__dirname, 'articles');

// Cria o diretório se não existir
if (!fs.existsSync(articleDir)) {
  fs.mkdirSync(articleDir, { recursive: true });
}

const imports = [];
const exports = [];

// Gera arquivo para cada artigo
articleObjects.forEach((article, index) => {
  const slug = article.slug;
  const date = article.date;
  const fileName = `${date}-${slug}.ts`;
  const filePath = path.join(articleDir, fileName);
  
  // Nome da variável para import
  const varName = slug.replace(/-/g, '_');
  imports.push(`import { article as ${varName} } from './${date}-${slug}';`);
  exports.push(varName);
  
  const fileContent = `import { Article } from './types';

export const article: Article = ${JSON.stringify(article, null, 2)};
`;
  
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`✓ Criado: ${fileName}`);
});

// Atualiza o index.ts
const indexContent = `import { Article } from './types';

// Import all article files
${imports.join('\n')}

// Consolidated array of all articles
export const allArticles: Article[] = [
  ${exports.join(',\n  ')}
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// Helper function to get article by slug
export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find(article => article.slug === slug);
}

// Helper function to get articles by category
export function getArticlesByCategory(category: string): Article[] {
  return allArticles.filter(article => article.category === category);
}

// Helper function to get articles by tag (if needed in future)
export function getArticlesByTag(tag: string): Article[] {
  // This can be extended when tags are added to Article interface
  return allArticles;
}

// Helper function to get recent articles
export function getRecentArticles(limit: number = 5): Article[] {
  return allArticles.slice(0, limit);
}

// Helper function to get all unique categories
export function getAllCategories(): string[] {
  const categories = allArticles.map(article => article.category);
  return Array.from(new Set(categories)).sort();
}

// Export for backward compatibility
export const articles = allArticles;
`;

fs.writeFileSync(path.join(articleDir, 'index.ts'), indexContent, 'utf8');
console.log('\n✓ index.ts atualizado com todos os imports');

console.log(`\n✅ Processo concluído! ${articleObjects.length} artigos foram criados.`);
console.log('\nPróximos passos:');
console.log('1. Atualize os imports nos componentes para usar: import { articles } from "@/data/articles"');
console.log('2. (Opcional) Remova ou deprecie o arquivo articles.ts original');
