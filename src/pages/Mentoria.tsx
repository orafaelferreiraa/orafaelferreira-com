import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Mentorship from "@/components/Mentorship";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import JsonLd, { breadcrumbSchema } from "@/components/SEO/JsonLd";

const Mentoria = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.mentorship.title")}</title>
        <meta name="description" content={t("pages.mentorship.description")} />
        <meta property="og:title" content={t("pages.mentorship.title")} />
        <meta property="og:description" content={t("pages.mentorship.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.orafaelferreira.com/mentoria-cloud-devops" />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pages.mentorship.title")} />
        <meta name="twitter:description" content={t("pages.mentorship.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/mentoria-cloud-devops" />
      </Helmet>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://www.orafaelferreira.com/" },
        { name: "Mentoria Cloud & DevOps", url: "https://www.orafaelferreira.com/mentoria-cloud-devops" },
      ])} />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Mentorship />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Mentoria;
