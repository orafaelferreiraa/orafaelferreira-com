import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Recommendations from "@/components/Recommendations";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Recomendacoes = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.recommendations.title")}</title>
        <meta name="description" content={t("pages.recommendations.description")} />
        <meta property="og:title" content={t("pages.recommendations.title")} />
        <meta property="og:description" content={t("pages.recommendations.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/recomendacoes" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Recommendations />
        <Footer />
      </div>
    </>
  );
};

export default Recomendacoes;
