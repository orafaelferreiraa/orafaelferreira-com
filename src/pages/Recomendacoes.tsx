import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Recommendations from "@/components/Recommendations";
import Footer from "@/components/Footer";

const Recomendacoes = () => {
  return (
    <>
      <Helmet>
        <title>Recomendações - Rafael Martin</title>
        <meta name="description" content="Plataformas de cursos online, canais do YouTube e podcasts recomendados para aprendizado em Cloud, DevOps e tecnologia." />
        <meta property="og:title" content="Recomendações - Rafael Martin" />
        <meta property="og:description" content="Recursos recomendados para desenvolvimento profissional em tecnologia." />
        <link rel="canonical" href="https://www.orafaelferreira.com/recomendacoes" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Recommendations />
        <Footer />
      </div>
    </>
  );
};

export default Recomendacoes;
