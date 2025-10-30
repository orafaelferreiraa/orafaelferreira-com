import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>{t("pages.home.title")}</title>
        <meta name="description" content={t("pages.home.description")} />
        <meta property="og:title" content={t("pages.home.title")} />
        <meta property="og:description" content={t("pages.home.ogDescription")} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.orafaelferreira.com/" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <About />
        <Footer />
      </div>
    </>
  );
};

export default Home;
