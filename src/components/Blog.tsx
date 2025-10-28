import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { articles } from "@/data/articles";

const Blog = () => {

  return (
    <section id="blog" className="py-20 lg:py-32 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
            <span className="text-primary">Artigos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conteúdo técnico sobre Cloud, DevOps e Platform Engineering
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {articles.map((article, index) => (
            <Link key={article.slug} to={`/artigos/${article.slug}`}>
              <Card
                className="group overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 animate-fade-in-up h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
              <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {article.category}
                    </span>
                    <span className="text-muted-foreground">{article.readTime}</span>
                  </div>

                  <h3 className="text-xl font-heading font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.date).toLocaleDateString("pt-BR")}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="group/btn"
                    >
                      Ler mais
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="group" asChild>
            <Link to="/blog">
              Ver todos os artigos
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
