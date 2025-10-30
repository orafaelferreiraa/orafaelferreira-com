import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Certificates from "@/components/Certificates";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Certificados = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.certificates.title")}</title>
        <meta
          name="description"
          content={t("pages.certificates.description")}
        />
        <meta
          name="keywords"
          content={t("pages.certificates.keywords")}
        />
        <meta property="og:title" content={t("pages.certificates.title")} />
        <meta
          property="og:description"
          content={t("pages.certificates.ogDescription")}
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.orafaelferreira.com/certificados" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Certificates />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Certificados;
