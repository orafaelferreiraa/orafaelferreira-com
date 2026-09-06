import { Link, useLocation } from "react-router";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

/**
 * 404 page. Also prerendered to dist/404.html, which Azure Static Web Apps
 * serves with a real 404 status via `responseOverrides` in staticwebapp.config.json.
 */
const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const suggestions: { to: string; label: string }[] = [
    { to: "/blog", label: t("nav.blog") },
    { to: "/palestras", label: t("nav.talks") },
    { to: "/mentoria-cloud-devops", label: t("nav.mentorship") },
    { to: "/certificacoes", label: t("nav.certifications") },
  ];

  return (
    <>
      <Helmet>
        <title>{`${t("notFound.title")} | Rafael Ferreira`}</title>
        <meta name="description" content={t("notFound.description")} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-background px-4 py-32">
          <div className="text-center max-w-xl">
            <p className="text-7xl font-heading font-bold text-primary mb-4" aria-hidden="true">404</p>
            <h1 className="mb-4 text-3xl font-heading font-bold text-foreground">{t("notFound.title")}</h1>
            <p className="mb-8 text-lg text-muted-foreground">{t("notFound.description")}</p>
            <Link to="/">
              <Button>{t("notFound.backHome")}</Button>
            </Link>
            <p className="mt-10 mb-3 text-sm font-medium text-muted-foreground">{t("notFound.suggestionsTitle")}</p>
            <ul className="flex flex-wrap justify-center gap-3 text-sm">
              {suggestions.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-primary underline-offset-4 hover:underline">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NotFound;
