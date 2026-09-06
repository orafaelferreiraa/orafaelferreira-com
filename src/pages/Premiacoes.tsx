import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Awards, { awards } from "@/components/Awards";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import JsonLd, { breadcrumbSchema, collectionPageSchema, itemListSchema } from "@/components/SEO/JsonLd";

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
        <meta property="og:url" content="https://www.orafaelferreira.com/premiacoes" />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pages.awards.title")} />
        <meta name="twitter:description" content={t("pages.awards.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/premiacoes" />
      </Helmet>
      <JsonLd data={[
        collectionPageSchema({
          name: "Premiações - Rafael Ferreira",
          description: "Reconhecimentos e premiações conquistados por Rafael Ferreira: Microsoft MVP, Alura Star, DevOps Institute Ambassador e mais.",
          url: "https://www.orafaelferreira.com/premiacoes",
        }),
        itemListSchema({
          name: "Prêmios e reconhecimentos de Rafael Ferreira",
          url: "https://www.orafaelferreira.com/premiacoes",
          items: awards.map((award) => ({
            "@type": "EducationalOccupationalCredential",
            name: t(`awards.items.${award.id}.title`),
            description: t(`awards.items.${award.id}.description`),
            credentialCategory: "award",
            dateCreated: award.year,
            image: award.image,
            ...(award.link && { url: award.link }),
            recognizedBy: { "@type": "Organization", name: t(`awards.items.${award.id}.category`) },
          })),
        }),
        breadcrumbSchema([
          { name: "Home", url: "https://www.orafaelferreira.com/" },
          { name: "Premiações", url: "https://www.orafaelferreira.com/premiacoes" },
        ]),
      ]} />
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
