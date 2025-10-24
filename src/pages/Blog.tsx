import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import BlogComponent from "@/components/Blog";
import Footer from "@/components/Footer";

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Artigos - Rafael Martin</title>
        <meta name="description" content="Artigos técnicos sobre Azure, DevOps, Observabilidade, FinOps e Comunidade. Compartilhando conhecimento e experiências da área." />
        <meta property="og:title" content="Artigos - Rafael Martin" />
        <meta property="og:description" content="Artigos técnicos sobre Azure, DevOps, Observabilidade, FinOps e Comunidade." />
        <link rel="canonical" href="https://orafaelferreira.com/blog" />
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
