import { useParams, Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, Calendar, Clock, RefreshCw, User } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { articles, getArticleBySlug } from "@/data/articles";
import type { Article } from "@/data/articles/types";
import { countWords, extractHeadings, markdownToHtml } from "@/lib/markdown";
import { extractFirstImage } from "@/lib/extractImage";
import { getArticleTags } from "@/lib/article-tags";
import { formatLongDate } from "@/lib/format-date";
import JsonLd, { articleFaqSchema, articleSchema, breadcrumbSchema, organizationSchema, toIsoDateTime } from "@/components/SEO/JsonLd";

const SITE_URL = "https://www.orafaelferreira.com";
const AUTHOR_NAME = "Rafael Martin Alves Ferreira";
const ARTICLE_FOOTER_LOGO_URL = "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/Logo2.png";

/** Up to 3 articles sharing tags (weight 2) or category (weight 1), newest first on ties. */
function findRelated(article: Article, all: Article[]): Article[] {
  const tags = new Set(getArticleTags(article));
  return all
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => {
      const shared = getArticleTags(candidate).filter((tag) => tags.has(tag)).length;
      const score = shared * 2 + (candidate.category === article.category ? 1 : 0);
      return { candidate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.candidate.date.localeCompare(a.candidate.date))
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}

const ArtigoDetalhes = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "pt-BR";
  const article = slug ? getArticleBySlug(slug) : undefined;

  // Converter markdown para HTML apenas uma vez
  const htmlContent = useMemo(() => (article ? markdownToHtml(article.content) : ""), [article]);
  const headings = useMemo(() => (article ? extractHeadings(article.content) : []), [article]);
  const wordCount = useMemo(() => (article ? countWords(article.content) : 0), [article]);
  const related = useMemo(() => (article ? findRelated(article, articles) : []), [article]);

  // Imagem para Open Graph / cards. Prioridade: ogImage > image > badge > primeira do conteúdo
  const articleImage = useMemo(() => {
    if (!article) return null;
    return article.ogImage || article.image || article.badges?.[0]?.image || extractFirstImage(article.content);
  }, [article]);

  if (!article) {
    return (
      <>
        <Helmet>
          <title>{t("article.notFoundTitle")} | Rafael Ferreira</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen">
          <Navigation />
          <main className="container mx-auto px-4 py-32 max-w-3xl">
            <h1 className="text-3xl font-heading font-bold mb-4">{t("article.notFoundTitle")}</h1>
            <p className="text-muted-foreground mb-8">{t("article.notFoundDescription")}</p>
            <Link to="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("article.backToList")}
              </Button>
            </Link>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const articleUrl = `${SITE_URL}/artigos/${article.slug}`;
  const pageTitle = `${article.title} - Rafael Martin`;
  const tags = getArticleTags(article);
  const summary = article.summary && article.summary.length > 0 ? article.summary : [article.excerpt];
  const showToc = headings.length >= 3;
  const isTechnical = article.category === "Artigos";

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={article.excerpt} />

        {/* Open Graph tags para compartilhamento em redes sociais */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        {articleImage && <meta property="og:image" content={articleImage} />}
        {articleImage && article.ogImage && <meta property="og:image:width" content="1200" />}
        {articleImage && article.ogImage && <meta property="og:image:height" content="630" />}
        {articleImage && <meta property="og:image:alt" content={article.title} />}

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={article.excerpt} />
        {articleImage && <meta name="twitter:image" content={articleImage} />}

        {/* Article metadata */}
        <meta property="article:published_time" content={toIsoDateTime(article.date)} />
        <meta property="article:modified_time" content={toIsoDateTime(article.updatedAt ?? article.date)} />
        <meta property="article:author" content={AUTHOR_NAME} />
        <meta property="article:section" content={article.category} />
        {tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        <link rel="canonical" href={articleUrl} />
      </Helmet>
      <JsonLd data={[
        organizationSchema(),
        articleSchema({
          title: article.title,
          excerpt: article.excerpt,
          slug: article.slug,
          date: article.date,
          updatedAt: article.updatedAt,
          category: article.category,
          image: articleImage,
          imageIsOgCard: Boolean(article.ogImage),
          tags,
          keywords: article.keywords,
          wordCount,
          summary: article.summary,
        }),
        breadcrumbSchema([
          { name: "Home", url: `${SITE_URL}/` },
          { name: "Blog", url: `${SITE_URL}/blog` },
          { name: article.title, url: articleUrl },
        ]),
        ...(article.faq && article.faq.length > 0 ? [articleFaqSchema(article.slug, article.faq)] : []),
      ]} />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <article className="py-20 lg:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
              <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
                <ol className="flex flex-wrap items-center gap-2">
                  <li><Link to="/" className="hover:text-primary transition-colors">{t("article.breadcrumbHome")}</Link></li>
                  <li aria-hidden="true">/</li>
                  <li><Link to="/blog" className="hover:text-primary transition-colors">{t("article.breadcrumbBlog")}</Link></li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-foreground line-clamp-1">{article.title}</li>
                </ol>
              </nav>

              <header className="mb-8">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {article.readTime}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>{t("article.by")} </span>
                    <Link to="/" rel="author" className="text-foreground hover:text-primary transition-colors">{AUTHOR_NAME}</Link>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    <span>{t("article.publishedOn")} </span>
                    <time dateTime={article.date}>{formatLongDate(article.date, lang)}</time>
                  </span>
                  {article.updatedAt && article.updatedAt !== article.date && (
                    <span className="inline-flex items-center gap-1.5">
                      <RefreshCw className="h-4 w-4" aria-hidden="true" />
                      <span>{t("article.updatedOn")} </span>
                      <time dateTime={article.updatedAt}>{formatLongDate(article.updatedAt, lang)}</time>
                    </span>
                  )}
                </div>

                {tags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
                    {tags.map((tag) => (
                      <li key={tag}>
                        <Link
                          to={`/blog?q=${encodeURIComponent(tag)}`}
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {tag}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </header>

              <aside
                data-speakable="summary"
                className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-6"
                aria-labelledby="article-summary-title"
              >
                <h2 id="article-summary-title" className="text-sm font-semibold uppercase tracking-wide text-primary mb-3">
                  {t("article.summaryTitle")}
                </h2>
                {summary.length === 1 ? (
                  <p className="leading-relaxed text-foreground/90">{summary[0]}</p>
                ) : (
                  <ul className="list-disc list-inside space-y-2 leading-relaxed text-foreground/90">
                    {summary.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                )}
              </aside>

              {showToc && (
                <nav aria-labelledby="article-toc-title" className="mb-10 rounded-2xl border border-border bg-card/40 p-6">
                  <h2 id="article-toc-title" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                    {t("article.tocTitle")}
                  </h2>
                  <ol className="space-y-1.5 text-sm">
                    {headings.map((heading) => (
                      <li key={heading.id} className={heading.level === 3 ? "ml-4" : ""}>
                        <a href={`#${heading.id}`} className="text-foreground/80 hover:text-primary transition-colors">
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {article.faq && article.faq.length > 0 && (
                <section aria-labelledby="article-faq-title" className="mt-14">
                  <h2 id="article-faq-title" className="text-2xl font-heading font-bold mb-6">
                    {t("article.faqTitle")}
                  </h2>
                  <dl className="space-y-6">
                    {article.faq.map((item) => (
                      <div key={item.q} className="rounded-xl border border-border bg-card/40 p-5">
                        <dt className="font-semibold text-foreground mb-2">{item.q}</dt>
                        <dd className="text-muted-foreground leading-relaxed">{item.a}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}

              <div className="mt-10 flex justify-center">
                <img
                  src={ARTICLE_FOOTER_LOGO_URL}
                  alt="Logo LowOps, canal de Rafael Ferreira"
                  className="max-h-28 md:max-h-32 w-auto"
                  width={256}
                  height={128}
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {related.length > 0 && (
                <section aria-labelledby="related-title" className="mt-14 pt-10 border-t border-border">
                  <h2 id="related-title" className="text-2xl font-heading font-bold mb-6">
                    {t("article.relatedTitle")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {related.map((item) => (
                      <Link key={item.slug} to={`/artigos/${item.slug}`} className="group">
                        <Card className="h-full p-5 rounded-2xl border border-primary/10 bg-card/40 hover:-translate-y-1 hover:shadow-[0_8px_32px_hsl(var(--primary)/0.08)] transition-all duration-300">
                          <span className="text-xs font-medium text-primary">{item.category}</span>
                          <h3 className="mt-2 font-heading font-semibold group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
                          <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                            {t("blog.readMore")}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                          </span>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-12 pt-8 border-t border-border">
                <Link to={isTechnical ? "/blog" : "/blog?tab=posts"}>
                  <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("article.allArticles")}
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ArtigoDetalhes;
