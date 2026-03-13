import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders JSON-LD structured data in the <head> for SEO and GEO (Generative Engine Optimization).
 * Accepts a single schema object or an array of schemas.
 */
const JsonLd = ({ data }: JsonLdProps) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(data)}</script>
  </Helmet>
);

export default JsonLd;

// --- Reusable schema builders ---

const SITE_URL = "https://www.orafaelferreira.com";
const PERSON_NAME = "Rafael Martin Alves Ferreira";
const PERSON_SHORT = "Rafael Ferreira";

export const personSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: PERSON_NAME,
  alternateName: PERSON_SHORT,
  url: SITE_URL,
  image: `${SITE_URL}/og-image.jpg`,
  jobTitle: "Cloud & DevOps Specialist",
  worksFor: {
    "@type": "Organization",
    name: "Microsoft MVP",
  },
  sameAs: [
    "https://www.linkedin.com/in/orafaelferreiraa/",
    "https://github.com/orafaelferreiraa",
    "https://www.youtube.com/@LowOps",
    "https://www.instagram.com/orafaelferreira1/",
    "https://open.spotify.com/show/0U4kcZT2Cwn4CqQGg4Ywcj",
  ],
  knowsAbout: [
    "Microsoft Azure",
    "DevOps",
    "Platform Engineering",
    "FinOps",
    "Terraform",
    "Kubernetes",
    "Cloud Architecture",
    "Observability",
  ],
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${PERSON_SHORT} | Cloud & DevOps Specialist`,
  url: SITE_URL,
  inLanguage: ["pt-BR", "en"],
  author: { "@type": "Person", name: PERSON_NAME },
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbSchema = (
  items: { name: string; url: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

export const articleSchema = (article: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  category: string;
  image?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.excerpt,
  url: `${SITE_URL}/artigos/${article.slug}`,
  datePublished: article.date,
  author: {
    "@type": "Person",
    name: PERSON_NAME,
    url: SITE_URL,
  },
  publisher: {
    "@type": "Person",
    name: PERSON_NAME,
    url: SITE_URL,
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `${SITE_URL}/artigos/${article.slug}`,
  },
  articleSection: article.category,
  inLanguage: "pt-BR",
  ...(article.image && {
    image: {
      "@type": "ImageObject",
      url: article.image,
      width: 1200,
      height: 630,
    },
  }),
});

export const collectionPageSchema = (page: {
  name: string;
  description: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: page.name,
  description: page.description,
  url: page.url,
  author: { "@type": "Person", name: PERSON_NAME, url: SITE_URL },
  inLanguage: ["pt-BR", "en"],
});
