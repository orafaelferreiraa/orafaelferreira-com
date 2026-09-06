import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Talks from "@/components/Talks";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import JsonLd, { breadcrumbSchema, collectionPageSchema } from "@/components/SEO/JsonLd";

const Palestras = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.talks.title")}</title>
        <meta name="description" content={t("pages.talks.description")} />
        <meta property="og:title" content={t("pages.talks.title")} />
        <meta property="og:description" content={t("pages.talks.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.orafaelferreira.com/palestras" />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pages.talks.title")} />
        <meta name="twitter:description" content={t("pages.talks.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/palestras" />
      </Helmet>
      <JsonLd data={[
        collectionPageSchema({
          name: "Palestras - Rafael Ferreira",
          description: "Palestras e apresentações sobre Azure, DevOps, Cloud, FinOps e Platform Engineering.",
          url: "https://www.orafaelferreira.com/palestras",
        }),
        breadcrumbSchema([
          { name: "Home", url: "https://www.orafaelferreira.com/" },
          { name: "Palestras", url: "https://www.orafaelferreira.com/palestras" },
        ]),
      ]} />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Talks />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Palestras;
