export interface Badge {
  name: string;
  provider: string;
  image: string;
  link: string;
}

export interface ArticleFaq {
  /** Pergunta, em pt-BR, como o leitor a faria */
  q: string;
  /** Resposta curta e direta (1 a 3 frases). Alimenta a seção FAQ e o schema FAQPage */
  a: string;
}

/**
 * Modelo de artigo / post.
 *
 * Os campos `slug`, `title`, `excerpt`, `date`, `updatedAt`, `category` e `image`
 * são lidos em build time pelos geradores em scripts/ (sitemap, RSS, llms.txt) —
 * mantenha-os como string literals simples.
 */
export interface Article {
  slug: string;
  title: string;
  /** 120 a 160 caracteres: vira a meta description e o texto do card */
  excerpt: string;
  content: string;
  /** Data de publicação, YYYY-MM-DD */
  date: string;
  /** Data da última revisão relevante, YYYY-MM-DD. Alimenta dateModified e <lastmod> */
  updatedAt?: string;
  category: string;
  readTime: string;
  image?: string;  // URL da imagem de capa (cards, RSS, sitemap de imagens)
  /** Imagem 1200x630 para compartilhamento (og:image). Se ausente, usa `image` sem declarar dimensões */
  ogImage?: string;
  badges?: Badge[];
  tags?: string[];         // Tópicos forçados (além dos derivados por palavra-chave)
  excludeTags?: string[];  // Tópicos a remover mesmo que sejam derivados por palavra-chave
  /** Palavras-chave adicionais para schema.org `keywords` */
  keywords?: string[];
  /** Pontos-chave exibidos no topo do artigo ("Resumo") e usados como speakable */
  summary?: string[];
  /** Perguntas frequentes exibidas ao fim do artigo e publicadas como FAQPage */
  faq?: ArticleFaq[];
}
