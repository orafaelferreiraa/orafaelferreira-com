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
  mediumUrl: string;
  badges?: Badge[];
}
