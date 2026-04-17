import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import BlogComponent from "@/components/Blog";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import JsonLd, { breadcrumbSchema, collectionPageSchema } from "@/components/SEO/JsonLd";

const Blog = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.blog.title")}</title>
        <meta name="description" content={t("pages.blog.description")} />
        <meta property="og:title" content={t("pages.blog.title")} />
        <meta property="og:description" content={t("pages.blog.description")} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.orafaelferreira.com/blog" />
        <meta property="og:site_name" content="Rafael Ferreira" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:image" content="https://www.orafaelferreira.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("pages.blog.title")} />
        <meta name="twitter:description" content={t("pages.blog.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/blog" />
      </Helmet>
      <JsonLd data={[
        collectionPageSchema({
          name: "Blog - Rafael Ferreira",
          description: "Artigos e posts sobre Azure, DevOps, Cloud, FinOps, Platform Engineering e Kubernetes.",
          url: "https://www.orafaelferreira.com/blog",
        }),
        breadcrumbSchema([
          { name: "Home", url: "https://www.orafaelferreira.com/" },
          { name: "Blog", url: "https://www.orafaelferreira.com/blog" },
        ]),
      ]} />
      <div className="min-h-screen">
        <Navigation />
        <main>
          <BlogComponent />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Blog;
