import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import LatestArticles from "@/components/LatestArticles";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import JsonLd, { personSchema, websiteSchema, organizationSchema, breadcrumbSchema, profilePageSchema, faqSchema } from "@/components/SEO/JsonLd";

const Home = () => {
  const { t, i18n } = useTranslation();
  const faqLang = (i18n.language || "pt-BR").startsWith("en") ? "en" : "pt-BR";
  return (
    <>
      <Helmet>
        <title>{t("pages.home.title")}</title>
        <meta name="description" content={t("pages.home.description")} />
        <meta property="og:title" content={t("pages.home.title")} />
        <meta property="og:description" content={t("pages.home.ogDescription")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.orafaelferreira.com/" />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <meta property="og:image:alt" content="Rafael Ferreira - Cloud & DevOps Specialist" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pages.home.title")} />
        <meta name="twitter:description" content={t("pages.home.ogDescription")} />
        <meta name="twitter:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <link rel="canonical" href="https://www.orafaelferreira.com/" />
      </Helmet>
      <JsonLd data={[personSchema(), organizationSchema(), websiteSchema(), profilePageSchema(), breadcrumbSchema([{ name: "Home", url: "https://www.orafaelferreira.com/" }]), faqSchema(faqLang)]} />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Hero />
          <About />
          <LatestArticles />
          <Partners />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
