import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Talks, { inPersonTalks, onlineTalks, upcomingTalks } from "@/components/Talks";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import JsonLd, { breadcrumbSchema, collectionPageSchema, itemListSchema, talkEventSchema } from "@/components/SEO/JsonLd";

const PAGE_URL = "https://www.orafaelferreira.com/palestras";

const Palestras = () => {
  const { t } = useTranslation();

  const allTalks = [...upcomingTalks, ...inPersonTalks, ...onlineTalks]
    .filter((talk) => /^\d{4}-\d{2}-\d{2}$/.test(talk.date))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <Helmet>
        <title>{t("pages.talks.title")}</title>
        <meta name="description" content={t("pages.talks.description")} />
        <meta property="og:title" content={t("pages.talks.title")} />
        <meta property="og:description" content={t("pages.talks.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pages.talks.title")} />
        <meta name="twitter:description" content={t("pages.talks.description")} />
        <link rel="canonical" href={PAGE_URL} />
      </Helmet>
      <JsonLd data={[
        collectionPageSchema({
          name: "Palestras - Rafael Ferreira",
          description: "Palestras e apresentações sobre Azure, DevOps, Cloud, FinOps e Platform Engineering.",
          url: PAGE_URL,
        }),
        itemListSchema({
          name: "Palestras de Rafael Ferreira",
          url: PAGE_URL,
          items: allTalks.map(talkEventSchema),
        }),
        breadcrumbSchema([
          { name: "Home", url: "https://www.orafaelferreira.com/" },
          { name: "Palestras", url: PAGE_URL },
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
