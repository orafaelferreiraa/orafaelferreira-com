/**
 * Extrai a primeira imagem do conteúdo markdown
 * Suporta formatos: ![alt](url) e <img src="url">
 */
export const extractFirstImage = (content: string): string | null => {
  // Coleta TODAS as imagens markdown suportando título opcional para decidir melhor thumbnail
  const images: string[] = [];
  const markdownImageGlobal = /!\[[^\]]*\]\((\S+?)(?:\s+(".*?"|'.*?'|\(.*?\)))?\)/g;
  let m: RegExpExecArray | null;
  while ((m = markdownImageGlobal.exec(content)) !== null) {
    if (m[1]) images.push(m[1]);
  }

  // Heurística: prefira imagens maiores/de capa (png/jpg/jpeg/webp) e evite thumbs pequenas (ex.: credly size=118)
  const preferred = images.find(url =>
    /\.(png|jpe?g|webp)(\?.*)?$/i.test(url) && !/images\.credly\.com\/size\/118x118/i.test(url)
  );
  if (preferred) return preferred;

  if (images.length > 0) return images[0];

  // Tenta encontrar imagem no formato HTML <img src="url">
  const htmlImageRegex = /<img[^>]+src="([^">]+)"/i;
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
