import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import JsonLd, { breadcrumbSchema, collectionPageSchema } from "@/components/SEO/JsonLd";

const Experiencias = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.experience.title")}</title>
        <meta name="description" content={t("pages.experience.description")} />
        <meta property="og:title" content={t("pages.experience.title")} />
        <meta property="og:description" content={t("pages.experience.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.orafaelferreira.com/experiencias" />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pages.experience.title")} />
        <meta name="twitter:description" content={t("pages.experience.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/experiencias" />
      </Helmet>
      <JsonLd data={[
        collectionPageSchema({
          name: "Experiências - Rafael Ferreira",
          description: "Trajetória e experiências profissionais de Rafael Ferreira em Cloud, DevOps e Platform Engineering.",
          url: "https://www.orafaelferreira.com/experiencias",
        }),
        breadcrumbSchema([
          { name: "Home", url: "https://www.orafaelferreira.com/" },
          { name: "Experiências", url: "https://www.orafaelferreira.com/experiencias" },
        ]),
      ]} />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Experience />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Experiencias;
