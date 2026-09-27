import { Calendar, ArrowRight, Search, X } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useMemo, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { articles } from "@/data/articles";
import { extractFirstImage } from "@/lib/extractImage";
import { getArticleTags, getAvailableTags, tagFromSlug, tagToSlug } from "@/lib/article-tags";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const postCategories = [
  "Posts",
  "Palestras",
  "Registro Eventos Presenciais",
  "Organização de Eventos",
  "Organizador Grupo de Comunidade",
  "Colaborações Externas"
];

// NFC porque "Organização de Eventos" aparece em duas formas Unicode nos dados.
const normalizeCategory = (value: string) =>
  value.normalize("NFC").trim().toLocaleLowerCase();

const postCategorySet = new Set(postCategories.map(normalizeCategory));

const isPostCategory = (category: string) =>
  postCategorySet.has(normalizeCategory(category));

const sortByDateDesc = (a: (typeof articles)[number], b: (typeof articles)[number]) =>
  new Date(`${b.date}T12:00:00`).getTime() - new Date(`${a.date}T12:00:00`).getTime();

// `articles` é um import estático, então as duas listas e o conjunto de temas são
// constantes de módulo: não há o que memoizar por render.
const artigosFiltered = articles.filter((article) => !isPostCategory(article.category)).sort(sortByDateDesc);
const postsFiltered = articles.filter((article) => isPostCategory(article.category)).sort(sortByDateDesc);

// Slugs resolvem contra as tags das duas abas para que `?tema=` não dependa de
// qual aba está aberta.
const allTags = getAvailableTags(articles);

/** O que o prerender enxerga: a rota é gerada sem query string. */
const NO_PARAMS = new URLSearchParams();

const neverChanges = () => () => {};
/** `false` durante a hidratação, `true` no render seguinte. */
const useHydrated = () =>
  useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );

const Blog = () => {
  const { t, i18n } = useTranslation();
  // `?q=` is the SearchAction target declared in the WebSite JSON-LD (JsonLd.tsx);
  // `?tab=posts` deep-links to the posts tab; `?tema=` carries the topic filter so a
  // filtered list is a plain, shareable link.
  const [searchParams, setSearchParams] = useSearchParams();

  // O prerender gera `/blog` sem query string, então o primeiro render do cliente
  // precisa ser idêntico a ele. Aplicar `?tab=`/`?tema=`/`?q=` já na hidratação
  // produz diferenças só de atributo (o `data-state` das abas, por exemplo), e a
  // hidratação do React não corrige atributo: o deep link ficava ignorado. Lendo a
  // URL só a partir do render seguinte, tudo é aplicado num render normal.
  const params = useHydrated() ? searchParams : NO_PARAMS;

  const query = (params.get("q") ?? "").trim();
  const activeTab = params.get("tab") === "posts" ? "posts" : "artigos";
  const [activePostCategory, setActivePostCategory] = useState<string | null>(null);

  const normalizeText = (value: string) =>
    value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase();

  const matchesQuery = (article: (typeof articles)[number]) => {
    if (!query) return true;
    const needle = normalizeText(query);
    const haystack = normalizeText(
      [article.title, article.excerpt, article.category, ...getArticleTags(article)].join(" ")
    );
    return haystack.includes(needle);
  };

  // Forma funcional de propósito: `searchParams` do closure fica velho entre um
  // clique e o re-render, e dois cliques rápidos acabariam lendo o mesmo estado.
  const patchParams = (mutate: (next: URLSearchParams) => void) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        mutate(next);
        return next;
      },
      { replace: true },
    );
  };

  const updateQuery = (value: string) => {
    patchParams((next) => {
      if (value.trim()) next.set("q", value);
      else next.delete("q");
    });
  };

  // `?tema=docker,devops` é UNIÃO: tudo de Docker mais tudo de DevOps. É o que
  // serve para montar a lista de uma submissão, onde se quer abrangência.
  const activeTags = useMemo(() => {
    const raw = params.get("tema");
    if (!raw) return [] as string[];
    const resolved = raw
      .split(",")
      .map((slug) => tagFromSlug(slug.trim(), allTags))
      .filter((tag): tag is string => tag !== null);
    return [...new Set(resolved)];
  }, [params]);

  const setActiveTags = (tags: string[]) => {
    patchParams((next) => {
      if (tags.length > 0) next.set("tema", tags.map(tagToSlug).join(","));
      else next.delete("tema");
    });
  };

  const toggleTag = (tag: string) => {
    // Lê o `tema` da própria URL dentro do updater, e não o `activeTags` do render:
    // é o que garante que dois cliques seguidos no mesmo chip liguem e desliguem.
    patchParams((next) => {
      const slug = tagToSlug(tag);
      const current = (next.get("tema") ?? "").split(",").filter(Boolean);
      const updated = current.includes(slug)
        ? current.filter((value) => value !== slug)
        : [...current, slug];
      if (updated.length > 0) next.set("tema", updated.join(","));
      else next.delete("tema");
    });
  };

  const handleTabChange = (value: string) => {
    // O tema sobrevive à troca de aba quando existe também na aba de destino —
    // filtrar "Docker" e conferir artigos e posts é o fluxo normal de submissão.
    const targetList = value === "posts" ? postsFiltered : artigosFiltered;
    const survivingTags = activeTags.filter((tag) => getAvailableTags(targetList).includes(tag));
    patchParams((next) => {
      if (value === "posts") next.set("tab", "posts");
      else next.delete("tab");
      if (survivingTags.length > 0) next.set("tema", survivingTags.map(tagToSlug).join(","));
      else next.delete("tema");
    });
    setActivePostCategory(null);
  };

  const postCategoriesAvailable = Array.from(
    new Set(postsFiltered.map((article) => article.category))
  );

  const postCategoryOrder = [
    "Palestras",
    "Organização de Eventos",
    "Registro Eventos Presenciais",
    "Organizador Grupo de Comunidade",
    "Colaborações Externas",
    "Posts"
  ];

  const orderedPostCategories = [
    ...postCategoryOrder.filter((category) => postCategoriesAvailable.includes(category)),
    ...postCategoriesAvailable.filter((category) => !postCategoryOrder.includes(category)).sort()
  ];

  /** Aplica tema, categoria e busca sobre a lista de uma aba. */
  const computeVisible = (list: typeof articles, isPostsTab: boolean) => {
    let visible = list;
    if (activeTags.length > 0) {
      // União: `?tema=docker,devops` traz Docker OU DevOps, não a interseção.
      visible = visible.filter((article) => {
        const tags = getArticleTags(article);
        return activeTags.some((tag) => tags.includes(tag));
      });
    }
    if (isPostsTab && activePostCategory) {
      visible = visible.filter((article) => article.category === activePostCategory);
    }
    return visible.filter(matchesQuery);
  };

  const renderPostCategoryFilters = () => {
    if (orderedPostCategories.length === 0) return null;

    return (
      <div className="max-w-7xl mx-auto mb-6">
        <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
          {t("blog.filterByCategory")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActivePostCategory(null)}
            aria-pressed={activePostCategory === null}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
              activePostCategory === null
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card/40 text-muted-foreground border-primary/10 hover:border-primary/40 hover:text-primary"
            )}
          >
            {t("blog.allCategories")}
          </button>
          {orderedPostCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActivePostCategory((current) => (current === category ? null : category))}
              aria-pressed={activePostCategory === category}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                activePostCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/40 text-muted-foreground border-primary/10 hover:border-primary/40 hover:text-primary"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderFilters = (list: typeof articles) => {
    const availableTags = getAvailableTags(list);
    if (availableTags.length === 0) return null;

    return (
      <div className="max-w-7xl mx-auto mb-10">
        <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
          {t("blog.filterByTopic")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label={t("blog.filterByTopic")}>
          <button
            type="button"
            onClick={() => setActiveTags([])}
            aria-pressed={activeTags.length === 0}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
              activeTags.length === 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card/40 text-muted-foreground border-primary/10 hover:border-primary/40 hover:text-primary"
            )}
          >
            {t("blog.allTopics")}
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              aria-pressed={activeTags.includes(tag)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                activeTags.includes(tag)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card/40 text-muted-foreground border-primary/10 hover:border-primary/40 hover:text-primary"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderArticleGrid = (list: typeof articles, isPostsTab: boolean) => {
    const visibleArticles = computeVisible(list, isPostsTab);

    if (visibleArticles.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-12">{t("blog.noResults")}</p>
      );
    }

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {visibleArticles.map((article, index) => {
        const coverImage = article.image || article.badges?.[0]?.image || extractFirstImage(article.content);
        const articleTags = getArticleTags(article).slice(0, 3);

        return (
          <Link key={article.slug} to={`/artigos/${article.slug}`}>
            <Card
            className="group overflow-hidden rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-sm hover:shadow-[0_8px_32px_hsl(var(--primary)/0.08)] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up h-full flex flex-col"
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

              {articleTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {articleTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(`${article.date}T12:00:00`).toLocaleDateString(
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
  };

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-foreground">
            {t("blog.title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {t("blog.description")}
          </p>
        </div>

        <form
          role="search"
          className="max-w-xl mx-auto mb-10"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="blog-search" className="sr-only">{t("blog.search")}</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="blog-search"
              name="q"
              type="search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder={t("blog.search")}
              autoComplete="off"
              className="w-full rounded-full border border-primary/10 bg-card/40 py-3 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => updateQuery("")}
                aria-label={t("blog.clearSearch")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-primary"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          {query && (
            <p className="mt-3 text-center text-sm text-muted-foreground">{t("blog.searchResults", { query })}</p>
          )}
        </form>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="artigos">{t("blog.articles")}</TabsTrigger>
            <TabsTrigger value="posts">{t("blog.posts")}</TabsTrigger>
          </TabsList>

          <TabsContent value="artigos" forceMount className="mt-0 data-[state=inactive]:hidden">
            {renderFilters(artigosFiltered)}
            {renderArticleGrid(artigosFiltered, false)}
          </TabsContent>

          <TabsContent value="posts" forceMount className="mt-0 data-[state=inactive]:hidden">
            {renderPostCategoryFilters()}
            {renderFilters(postsFiltered)}
            {renderArticleGrid(postsFiltered, true)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Blog;
