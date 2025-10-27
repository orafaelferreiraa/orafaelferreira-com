import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Certificates from "@/components/Certificates";
import Footer from "@/components/Footer";

const Certificados = () => {
  return (
    <>
      <Helmet>
        <title>Certificados | Rafael Ferreira - Cursos, Treinamentos e Eventos</title>
        <meta
          name="description"
          content="Certificados de cursos, treinamentos, eventos e palestras de Rafael Ferreira. Aprendizado contínuo em Cloud Computing, DevOps, Azure, Kubernetes, Terraform, Docker e tecnologias modernas."
        />
        <meta
          name="keywords"
          content="certificados de cursos, treinamentos tech, eventos tech, palestras, TDC, DevOpsDays, LINUXtips, Udemy, Microsoft Learn, Azure training, DevOps training, Kubernetes, Docker, Terraform"
        />
        <meta property="og:title" content="Certificados | Rafael Ferreira" />
        <meta
          property="og:description"
          content="Coleção completa de certificados de treinamentos, cursos e eventos que moldaram a jornada profissional de Rafael Ferreira em tecnologia."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://orafaelferreira.com/certificados" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Certificates />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Certificados;
