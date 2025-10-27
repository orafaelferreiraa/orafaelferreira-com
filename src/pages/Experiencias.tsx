import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";

const Experiencias = () => {
  return (
    <>
      <Helmet>
        <title>Experiências - Rafael Martin</title>
        <meta name="description" content="Conheça minha jornada profissional desde Assistente Técnico até Cloud Solution Architect Senior. Desafios superados, habilidades adquiridas e lições aprendidas." />
        <meta property="og:title" content="Experiências Profissionais - Rafael Martin" />
        <meta property="og:description" content="Jornada profissional em Cloud, DevOps e Engenharia de Plataforma." />
        <link rel="canonical" href="https://orafaelferreira.com/experiencias" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Experience />
        <Footer />
      </div>
    </>
  );
};

export default Experiencias;
