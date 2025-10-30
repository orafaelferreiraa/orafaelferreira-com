import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Awards from "@/components/Awards";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Premiacoes = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.awards.title")}</title>
        <meta
          name="description"
          content={t("pages.awards.description")}
        />
        <meta
          name="keywords"
          content="Rafael Ferreira, Microsoft MVP, MVP Azure, Alura Star, DevOps Institute Ambassador, Green Software Champion, premiações tech, reconhecimentos, comunidade tech, Azure, DevOps, sustentabilidade"
        />
        <meta property="og:title" content={t("pages.awards.title")} />
        <meta
          property="og:description"
          content={t("pages.awards.description")}
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.orafaelferreira.com/premiacoes" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Awards />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Premiacoes;
