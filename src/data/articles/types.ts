export interface Badge {
  name: string;
  provider: string;
  image: string;
  link: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  image?: string;  // URL da imagem da thumbnail para compartilhamento (og:image)
  badges?: Badge[];
  tags?: string[];         // Tópicos forçados (além dos derivados por palavra-chave)
  excludeTags?: string[];  // Tópicos a remover mesmo que sejam derivados por palavra-chave
}
