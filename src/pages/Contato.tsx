import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Contato = () => {
  return (
    <>
      <Helmet>
        <title>Contato - Rafael Martin</title>
        <meta name="description" content="Entre em contato para palestras, mentorias ou colaborações em Cloud, DevOps e Engenharia de Plataforma." />
        <meta property="og:title" content="Contato - Rafael Martin" />
        <meta property="og:description" content="Entre em contato para palestras, mentorias ou colaborações." />
        <link rel="canonical" href="https://orafaelferreira.com/contato" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Contact />
        <Footer />
      </div>
    </>
  );
};

export default Contato;
