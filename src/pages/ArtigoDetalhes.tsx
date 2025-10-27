import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/articles";

const ArtigoDetalhes = () => {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug);

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
                Voltar para Artigos
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
        <meta property="og:title" content={`${article.title} - Rafael Martin`} />
        <meta property="og:description" content={article.excerpt} />
        <link rel="canonical" href={`https://orafaelferreira.com/artigos/${article.slug}`} />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <article className="py-20 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link to="/blog" className="inline-block mb-8">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Artigos
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

              <p className="text-lg text-muted-foreground mb-8">
                {article.excerpt}
              </p>

              <a 
                href={article.mediumUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" size="sm">
                  Ver artigo original no Medium
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              {article.content.split('\n').map((paragraph, index) => {
                const trimmed = paragraph.trim();
                
                // Imagens
                if (trimmed.startsWith('![')) {
                  const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
                  if (match) {
                    const [, alt, src] = match;
                    return (
                      <img 
                        key={index} 
                        src={src} 
                        alt={alt} 
                        className="w-full rounded-lg my-6 shadow-md"
                        loading="lazy"
                      />
                    );
                  }
                }
                
                // Títulos
                if (trimmed.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold mt-8 mb-4">{trimmed.replace('# ', '')}</h1>;
                }
                if (trimmed.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold mt-6 mb-3">{trimmed.replace('## ', '')}</h2>;
                }
                if (trimmed.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{trimmed.replace('### ', '')}</h3>;
                }
                
                // Listas
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  return <li key={index} className="ml-6 mb-2">{trimmed.replace(/^[-*] /, '')}</li>;
                }
                
                // Código
                if (trimmed.startsWith('```')) {
                  return <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto my-4"><code>{trimmed.replace(/```\w*/, '')}</code></pre>;
                }
                
                // Negrito
                if (trimmed.includes('**')) {
                  const parts = trimmed.split(/\*\*(.*?)\*\*/g);
                  return (
                    <p key={index} className="mb-4 leading-relaxed">
                      {parts.map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </p>
                  );
                }
                
                // Linha vazia
                if (trimmed === '') {
                  return <br key={index} />;
                }
                
                // Parágrafo normal
                return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
              })}
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <Link to="/blog">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Ver todos os artigos
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
