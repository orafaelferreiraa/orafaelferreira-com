import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Sobre = () => {
  return (
    <>
      <Helmet>
        <title>Sobre - Rafael Martin</title>
        <meta name="description" content="Conheça minha trajetória profissional em Cloud, DevOps e Engenharia de Plataforma. Experiência em Azure, FinOps, IaC e muito mais." />
        <meta property="og:title" content="Sobre - Rafael Martin" />
        <meta property="og:description" content="Conheça minha trajetória profissional em Cloud, DevOps e Engenharia de Plataforma." />
        <link rel="canonical" href="https://orafaelferreira.com/sobre" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <About />
        <Footer />
      </div>
    </>
  );
};

export default Sobre;
