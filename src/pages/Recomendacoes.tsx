import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Recommendations, { categories } from "@/components/Recommendations";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import JsonLd, { breadcrumbSchema, collectionPageSchema, itemListSchema } from "@/components/SEO/JsonLd";

const Recomendacoes = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.recommendations.title")}</title>
        <meta name="description" content={t("pages.recommendations.description")} />
        <meta property="og:title" content={t("pages.recommendations.title")} />
        <meta property="og:description" content={t("pages.recommendations.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.orafaelferreira.com/recomendacoes" />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pages.recommendations.title")} />
        <meta name="twitter:description" content={t("pages.recommendations.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/recomendacoes" />
      </Helmet>
      <JsonLd data={[
        collectionPageSchema({
          name: "Recomendações - Rafael Ferreira",
          description: "Recomendações profissionais recebidas por Rafael Ferreira de colegas e parceiros da comunidade tech.",
          url: "https://www.orafaelferreira.com/recomendacoes",
        }),
        itemListSchema({
          name: "Recomendações de Rafael Ferreira: plataformas, canais e podcasts",
          url: "https://www.orafaelferreira.com/recomendacoes",
          items: categories.flatMap((category) =>
            category.items.map((item) => ({
              "@type": "WebSite",
              name: item.name,
              url: item.url,
              genre: t(category.titleKey),
            }))
          ),
        }),
        breadcrumbSchema([
          { name: "Home", url: "https://www.orafaelferreira.com/" },
          { name: "Recomendações", url: "https://www.orafaelferreira.com/recomendacoes" },
        ]),
      ]} />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Recommendations />
          <Partners />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Recomendacoes;
