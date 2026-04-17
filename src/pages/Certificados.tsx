import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Certificates from "@/components/Certificates";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import JsonLd, { breadcrumbSchema, collectionPageSchema } from "@/components/SEO/JsonLd";

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
        <meta property="og:url" content="https://www.orafaelferreira.com/certificados" />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pages.certificates.title")} />
        <meta name="twitter:description" content={t("pages.certificates.ogDescription")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/certificados" />
      </Helmet>
      <JsonLd data={[
        collectionPageSchema({
          name: "Certificados - Rafael Ferreira",
          description: "Certificados profissionais de cursos e treinamentos em Cloud, DevOps e tecnologias.",
          url: "https://www.orafaelferreira.com/certificados",
        }),
        breadcrumbSchema([
          { name: "Home", url: "https://www.orafaelferreira.com/" },
          { name: "Certificados", url: "https://www.orafaelferreira.com/certificados" },
        ]),
      ]} />
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
