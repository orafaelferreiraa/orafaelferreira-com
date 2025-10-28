import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import BlogComponent from "@/components/Blog";
import Footer from "@/components/Footer";

const Blog = () => {
  return (
    <>
      <Helmet>
        <title>Artigos/Posts - Rafael Martin</title>
        <meta name="description" content="Artigos técnicos e posts sobre Azure, DevOps, Observabilidade, FinOps, Comunidade e Eventos. Compartilhando conhecimento e experiências da área." />
        <meta property="og:title" content="Artigos/Posts - Rafael Martin" />
        <meta property="og:description" content="Artigos técnicos e posts sobre Azure, DevOps, Observabilidade, FinOps, Comunidade e Eventos." />
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
