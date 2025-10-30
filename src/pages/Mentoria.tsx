import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Mentorship from "@/components/Mentorship";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Mentoria = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.mentorship.title")}</title>
        <meta name="description" content={t("pages.mentorship.description")} />
        <meta property="og:title" content={t("pages.mentorship.title")} />
        <meta property="og:description" content={t("pages.mentorship.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/mentoria" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Mentorship />
        <Footer />
      </div>
    </>
  );
};

export default Mentoria;
