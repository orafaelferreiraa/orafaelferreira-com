import { useEffect } from 'react';

interface ArticleMetaTags {
  title: string;
  description: string;
  slug: string;
  image?: string;
  date: string;
  category: string;
}

/**
 * Hook para injetar meta tags OG em artigos
 * Garante que LinkedIn e outros crawlers consigam ler as tags
 */
export const useArticleMetaTags = (article: ArticleMetaTags | null) => {
  useEffect(() => {
    if (!article) return;

    // Função helper para criar/atualizar meta tag
    const setMeta = (attr: string, value: string, attrName = 'property') => {
      let meta = document.querySelector(`meta[${attrName}="${attr}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attr);
        document.head.appendChild(meta);
      }
      meta.content = value;
    };

    if (article.image) {
      // Meta tags Open Graph
      setMeta('og:title', `${article.title} - Rafael Martin`);
      setMeta('og:description', article.description);
      setMeta('og:type', 'article');
      setMeta('og:url', `https://www.orafaelferreira.com/artigos/${article.slug}`);
      setMeta('og:image', article.image);
      setMeta('og:image:width', '1200');
      setMeta('og:image:height', '630');
      setMeta('og:image:alt', article.title);

      // Twitter Card
      setMeta('twitter:card', 'summary_large_image', 'name');
      setMeta('twitter:title', `${article.title} - Rafael Martin`, 'name');
      setMeta('twitter:description', article.description, 'name');
      setMeta('twitter:image', article.image, 'name');

      // Article Metadata
      setMeta('article:published_time', article.date);
      setMeta('article:author', 'Rafael Martin');
      setMeta('article:section', article.category);

      // Description
      setMeta('description', article.description, 'name');
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://www.orafaelferreira.com/artigos/${article.slug}`;

  }, [article]);
};
