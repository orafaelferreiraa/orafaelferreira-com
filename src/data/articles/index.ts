import { Article } from './types';

// Auto-descoberta dos artigos via import.meta.glob (Vite).
// Os arquivos vivem em duas subpastas por categoria:
//   - ./artigos/*.ts      -> conteúdo técnico (category "Artigos")
//   - ./blog-posts/*.ts   -> posts, eventos e comunidade (demais categorias)
// Para adicionar um novo conteúdo, basta criar o arquivo na subpasta correta —
// não é necessário editar este index.
const modules = import.meta.glob<{ article: Article }>(
  ['./artigos/*.ts', './blog-posts/*.ts'],
  { eager: true },
);

export const allArticles: Article[] = Object.values(modules)
  .map((mod) => mod.article)
  .filter((article): article is Article => Boolean(article))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getArticleBySlug(slug: string): Article | undefined {
  return allArticles.find(article => article.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return allArticles.filter(article => article.category === category);
}

export function getArticlesByTag(tag: string): Article[] {
  return allArticles;
}

export function getRecentArticles(limit: number = 5): Article[] {
  return allArticles.slice(0, limit);
}

export function getAllCategories(): string[] {
  const categories = allArticles.map(article => article.category);
  return Array.from(new Set(categories)).sort();
}

export const articles = allArticles;
