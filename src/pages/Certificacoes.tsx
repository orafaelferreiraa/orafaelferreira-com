import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Certifications from "@/components/Certifications";
import Footer from "@/components/Footer";

const Certificacoes = () => {
  return (
    <>
      <Helmet>
        <title>Certificações | Rafael Ferreira - Azure, AWS, DevOps, Cloud</title>
        <meta
          name="description"
          content="Certificações profissionais de Rafael Ferreira em Cloud Computing, DevOps e tecnologias Microsoft Azure, AWS, HashiCorp, GitHub. Azure Solutions Architect Expert, DevOps Engineer Expert, Terraform Associate e muito mais."
        />
        <meta
          name="keywords"
          content="certificações Azure, Microsoft certifications, AWS certification, Azure Solutions Architect, DevOps Engineer, AZ-400, AZ-305, AZ-500, AZ-700, Terraform, GitHub, FinOps, ITIL, Cloud certifications"
        />
        <meta property="og:title" content="Certificações | Rafael Ferreira" />
        <meta
          property="og:description"
          content="Certificações profissionais em Cloud, DevOps e tecnologias Microsoft, AWS e Oracle conquistadas ao longo da jornada de Rafael Ferreira."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://orafaelferreira.com/certificacoes" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Certifications />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Certificacoes;
