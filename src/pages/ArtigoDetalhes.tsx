import { useParams, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/articles";
import { markdownToHtml } from "@/lib/markdown";
import { extractFirstImage } from "@/lib/extractImage";
import { useEffect, useMemo } from "react";

const ArtigoDetalhes = () => {
  const { slug } = useParams();
  const location = useLocation();
  const article = articles.find(a => a.slug === slug);

  // Converter markdown para HTML apenas uma vez
  const htmlContent = useMemo(() => {
    return article ? markdownToHtml(article.content) : '';
  }, [article]);

  // Extrair imagem do artigo para Open Graph
  const articleImage = useMemo(() => {
    if (!article) return null;
    // Prioridade: image explícito > badge image > primeira imagem do conteúdo
    return article.image || article.badges?.[0]?.image || extractFirstImage(article.content);
  }, [article]);

  // Injeta meta tags dinamicamente no documento para web crawlers
  useEffect(() => {
    if (!article || !articleImage) return;

    // Remove meta tags antigas
    document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').forEach(el => {
      if (el.getAttribute('property') !== 'og:image' && el.getAttribute('name') !== 'twitter:image') {
        el.remove();
      }
    });

    const metaTags = [
      { property: 'og:title', content: `${article.title} - Rafael Martin` },
      { property: 'og:description', content: article.excerpt },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `https://www.orafaelferreira.com/artigos/${article.slug}` },
      { property: 'og:image', content: articleImage },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: article.title },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: `${article.title} - Rafael Martin` },
      { name: 'twitter:description', content: article.excerpt },
      { name: 'twitter:image', content: articleImage },
      { property: 'article:published_time', content: article.date },
      { property: 'article:author', content: 'Rafael Martin' },
      { property: 'article:section', content: article.category },
    ];

    metaTags.forEach(({ property, name, content }) => {
      let meta = document.querySelector(`meta[${property ? 'property' : 'name'}="${property || name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Atualizar URL canônica
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link') as HTMLLinkElement;
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://www.orafaelferreira.com/artigos/${article.slug}`;

  }, [article, articleImage, location.pathname]);

  if (!article) {
    return (
      <>
        <Helmet>
          <title>Artigo não encontrado - Rafael Martin</title>
        </Helmet>
        <div className="min-h-screen">
          <Navigation />
          <div className="container mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Artigos/Posts
              </Button>
            </Link>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} - Rafael Martin</title>
        <meta name="description" content={article.excerpt} />
        
        {/* Open Graph tags para compartilhamento em redes sociais */}
        <meta property="og:title" content={`${article.title} - Rafael Martin`} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.orafaelferreira.com/artigos/${article.slug}`} />
        {articleImage && (
          <>
            <meta property="og:image" content={articleImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={article.title} />
          </>
        )}
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${article.title} - Rafael Martin`} />
        <meta name="twitter:description" content={article.excerpt} />
        {articleImage && <meta name="twitter:image" content={articleImage} />}
        
        {/* Article metadata */}
        <meta property="article:published_time" content={article.date} />
        <meta property="article:author" content="Rafael Martin" />
        <meta property="article:section" content={article.category} />
        
        <link rel="canonical" href={`https://www.orafaelferreira.com/artigos/${article.slug}`} />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <article className="py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link to="/blog" className="inline-block mb-8">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Artigos/Posts
              </Button>
            </Link>

            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                  {article.category}
                </span>
                <span className="text-muted-foreground text-sm">{article.readTime}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
                {article.title}
              </h1>

              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <Calendar className="h-4 w-4" />
                {new Date(article.date).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </div>

              {/* Excerpt é usado apenas em metadados SEO e cards; removido da visualização para evitar duplicação de conteúdo */}
            </div>

            <div 
              className="prose prose-lg dark:prose-invert max-w-none article-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <div className="mt-12 pt-8 border-t border-border">
              <Link to="/blog">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Ver todos os artigos/posts
                </Button>
              </Link>
            </div>
          </div>
        </article>
        <Footer />
      </div>
    </>
  );
};

export default ArtigoDetalhes;
