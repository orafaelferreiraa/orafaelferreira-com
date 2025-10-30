import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Talks from "@/components/Talks";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Palestras = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.talks.title")}</title>
        <meta name="description" content={t("pages.talks.description")} />
        <meta property="og:title" content={t("pages.talks.title")} />
        <meta property="og:description" content={t("pages.talks.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/palestras" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Talks />
        <Footer />
      </div>
    </>
  );
};

export default Palestras;
