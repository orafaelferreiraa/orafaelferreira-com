import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Certifications, { certifications } from "@/components/Certifications";
import Footer from "@/components/Footer";
import JsonLd, { breadcrumbSchema, collectionPageSchema, itemListSchema } from "@/components/SEO/JsonLd";

const PAGE_URL = "https://www.orafaelferreira.com/certificacoes";

const Certificacoes = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("pages.certificacoes.title")}</title>
        <meta name="description" content={t("pages.certificacoes.description")} />
        <meta
          name="keywords"
          content="certificações Azure, Microsoft certifications, AWS certification, Azure Solutions Architect, DevOps Engineer, AZ-400, AZ-305, AZ-500, AZ-700, Terraform, GitHub, FinOps, ITIL, Cloud certifications"
        />
        <meta property="og:title" content={t("pages.certificacoes.ogTitle")} />
        <meta property="og:description" content={t("pages.certificacoes.ogDescription")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pages.certificacoes.ogTitle")} />
        <meta name="twitter:description" content={t("pages.certificacoes.twitterDescription")} />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>
      <JsonLd data={[
        collectionPageSchema({
          name: "Certificações - Rafael Ferreira",
          description: "Certificações profissionais em Cloud Computing, DevOps, Microsoft Azure, AWS, HashiCorp Terraform e GitHub.",
          url: PAGE_URL,
        }),
        itemListSchema({
          name: "Certificações técnicas de Rafael Ferreira",
          url: PAGE_URL,
          items: certifications.map((cert) => ({
            "@type": "EducationalOccupationalCredential",
            name: cert.name,
            ...(cert.code && { identifier: cert.code }),
            credentialCategory: "certification",
            image: cert.image,
            url: cert.link,
            recognizedBy: { "@type": "Organization", name: cert.provider },
          })),
        }),
        breadcrumbSchema([
          { name: "Home", url: "https://www.orafaelferreira.com/" },
          { name: "Certificações", url: PAGE_URL },
        ]),
      ]} />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Certifications />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Certificacoes;
