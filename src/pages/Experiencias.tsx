import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Experiencias = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.experience.title")}</title>
        <meta name="description" content={t("pages.experience.description")} />
        <meta property="og:title" content={t("pages.experience.title")} />
        <meta property="og:description" content={t("pages.experience.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/experiencias" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Experience />
        <Footer />
      </div>
    </>
  );
};

export default Experiencias;
