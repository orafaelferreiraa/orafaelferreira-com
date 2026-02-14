import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { articles } from "@/data/articles";
import { extractFirstImage } from "@/lib/extractImage";
import { useTranslation } from "react-i18next";

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("artigos");

  const postCategories = [
    "Posts",
    "Registro Eventos Presenciais",
    "Organização de Eventos",
    "Organizador Grupo de Comunidade"
  ];

  const artigosFiltered = articles.filter(article => !postCategories.includes(article.category));
  const postsFiltered = articles.filter(article => postCategories.includes(article.category));

  const renderArticleGrid = (articlesList: typeof articles) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {articlesList.map((article, index) => {
        const coverImage = article.badges?.[0]?.image || extractFirstImage(article.content);
        
        return (
          <Link key={article.slug} to={`/artigos/${article.slug}`}>
            <Card
              className="group overflow-hidden rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm hover:shadow-[0_8px_32px_hsl(180_100%_50%/0.08)] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up h-full flex flex-col"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {coverImage && (
                <div className="relative w-full h-48 overflow-hidden bg-muted">
                  <img 
                    src={coverImage} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6 space-y-4 flex-1 flex flex-col">
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {article.category}
                  </span>
                  <span className="text-muted-foreground">{article.readTime}</span>
                </div>

                <h3 className="text-xl font-heading font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-muted-foreground line-clamp-3 flex-1">{article.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.date).toLocaleDateString(
                      i18n.language?.startsWith("pt") ? "pt-BR" : "en-US",
                      { year: "numeric", month: "2-digit", day: "2-digit" }
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="group/btn"
                  >
                    {t("blog.readMore")}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );

  return (
    <section id="blog" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            {t("blog.title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("blog.description")}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="artigos">{t("blog.articles")}</TabsTrigger>
            <TabsTrigger value="posts">{t("blog.posts")}</TabsTrigger>
          </TabsList>

          <TabsContent value="artigos" className="mt-0">
            {renderArticleGrid(artigosFiltered)}
          </TabsContent>

          <TabsContent value="posts" className="mt-0">
            {renderArticleGrid(postsFiltered)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Blog;
