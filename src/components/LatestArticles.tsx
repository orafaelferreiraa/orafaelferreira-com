import { Link } from "react-router";
import { ArrowRight, Calendar, GraduationCap, Mic } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { articles } from "@/data/articles";
import { extractFirstImage } from "@/lib/extractImage";
import { formatShortDate } from "@/lib/format-date";

const LATEST_COUNT = 3;

/**
 * Home teaser: newest technical articles plus contextual links to the talks
 * and mentorship pages. Gives crawlers (and visitors) internal links from the
 * body of the home page instead of only header/footer navigation.
 */
const LatestArticles = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "pt-BR";
  const latest = articles.filter((article) => article.category === "Artigos").slice(0, LATEST_COUNT);

  return (
    <section id="latest-articles" className="py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="latest-articles-title">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 id="latest-articles-title" className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              {t("home.latestArticlesTitle")}
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">{t("home.latestArticlesSubtitle")}</p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="group">
              {t("home.seeAllArticles")}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latest.map((article) => {
            const cover = article.image || article.badges?.[0]?.image || extractFirstImage(article.content);
            return (
              <Link key={article.slug} to={`/artigos/${article.slug}`} className="group">
                <Card className="h-full overflow-hidden rounded-2xl border border-primary/10 bg-card/40 hover:-translate-y-1 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.08)] transition-all duration-300 flex flex-col">
                  {cover && (
                    <div className="relative w-full h-44 overflow-hidden bg-muted">
                      <img
                        src={cover}
                        alt={article.title}
                        width={640}
                        height={360}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{article.category}</span>
                      <span className="text-muted-foreground">{article.readTime}</span>
                    </div>
                    <h3 className="text-lg font-heading font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{article.excerpt}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t border-border">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <time dateTime={article.date}>{formatShortDate(article.date, lang)}</time>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/palestras" className="group">
            <Card className="h-full p-6 rounded-2xl border border-primary/10 bg-card/40 hover:border-primary/40 transition-colors flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mic className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">{t("home.talksCtaTitle")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t("home.talksCtaDescription")}</p>
              </div>
            </Card>
          </Link>
          <Link to="/mentoria-cloud-devops" className="group">
            <Card className="h-full p-6 rounded-2xl border border-primary/10 bg-card/40 hover:border-primary/40 transition-colors flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading font-semibold group-hover:text-primary transition-colors">{t("home.mentorshipCtaTitle")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t("home.mentorshipCtaDescription")}</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestArticles;
