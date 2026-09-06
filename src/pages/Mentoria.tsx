import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Mentorship from "@/components/Mentorship";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import JsonLd, {
  breadcrumbSchema,
  personSchema,
  mentorshipServiceSchema,
  mentorshipFaqSchema,
  mentorshipWebPageSchema,
} from "@/components/SEO/JsonLd";

const MENTORSHIP_URL = "https://www.orafaelferreira.com/mentoria-cloud-devops";
const OG_IMAGE = "https://www.orafaelferreira.com/og-image.jpg";

const Mentoria = () => {
  const { t, i18n } = useTranslation();
  const title = t("pages.mentorship.title");
  const description = t("pages.mentorship.description");

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="mentoria cloud azure devops, mentor microsoft mvp, mentoria kubernetes terraform, carreira cloud computing, mentoria devops brasil, rafael ferreira mentor, plano de ação cloud, mentoria platform engineering"
        />
        <meta name="author" content="Rafael Martin Alves Ferreira" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={MENTORSHIP_URL} />
        <meta property="og:site_name" content="Rafael Ferreira | Cloud & DevOps Specialist" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Rafael Ferreira — Mentoria Cloud Azure e DevOps" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@orafaelferreira" />
        <meta name="twitter:creator" content="@orafaelferreira" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <link rel="canonical" href={MENTORSHIP_URL} />
      </Helmet>

      <JsonLd
        data={[
          personSchema(),
          mentorshipWebPageSchema(),
          mentorshipServiceSchema(),
          mentorshipFaqSchema((i18n.language || "pt-BR").startsWith("en") ? "en" : "pt-BR"),
          breadcrumbSchema([
            { name: "Home", url: "https://www.orafaelferreira.com/" },
            { name: "Mentoria Cloud & DevOps", url: MENTORSHIP_URL },
          ]),
        ]}
      />

      <div className="min-h-screen">
        <Navigation />
        <main>
          <Mentorship />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Mentoria;
