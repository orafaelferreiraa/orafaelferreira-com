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
  const { t } = useTranslation();
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
        const coverImage = extractFirstImage(article.content);
        
        return (
          <Link key={article.slug} to={`/artigos/${article.slug}`}>
            <Card
              className="group overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 animate-fade-in-up h-full flex flex-col"
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
                    {new Date(article.date).toLocaleDateString("pt-BR")}
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
    <section id="blog" className="py-20 lg:py-32 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
            <span className="text-primary">{t("blog.title")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
