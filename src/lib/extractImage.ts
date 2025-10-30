/**
 * Extrai a primeira imagem do conteúdo markdown
 * Suporta formatos: ![alt](url) e <img src="url">
 */
export const extractFirstImage = (content: string): string | null => {
  // Tenta encontrar imagem no formato markdown ![](url)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
  const markdownMatch = content.match(markdownImageRegex);
  
  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1];
  }
  
  // Tenta encontrar imagem no formato HTML <img src="url">
  const htmlImageRegex = /<img[^>]+src="([^">]+)"/;
  const htmlMatch = content.match(htmlImageRegex);
  
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1];
  }
  
  // Tenta encontrar YouTube thumbnail
  const youtubeRegex = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)|youtu\.be\/([a-zA-Z0-9_-]+)|youtube\.com\/vi\/([a-zA-Z0-9_-]+)/;
  const youtubeMatch = content.match(youtubeRegex);
  
  if (youtubeMatch) {
    const videoId = youtubeMatch[1] || youtubeMatch[2] || youtubeMatch[3];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  
  return null;
};
