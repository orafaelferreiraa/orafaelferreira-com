import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import BlogComponent from "@/components/Blog";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Blog = () => {
  const { t } = useTranslation();
  
  return (
    <>
      <Helmet>
        <title>{t("pages.blog.title")}</title>
        <meta name="description" content={t("pages.blog.description")} />
        <meta property="og:title" content={t("pages.blog.title")} />
        <meta property="og:description" content={t("pages.blog.description")} />
        <link rel="canonical" href="https://www.orafaelferreira.com/blog" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <BlogComponent />
        <Footer />
      </div>
    </>
  );
};

export default Blog;
