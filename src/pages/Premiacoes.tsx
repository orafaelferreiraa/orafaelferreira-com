import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Awards from "@/components/Awards";
import Footer from "@/components/Footer";

const Premiacoes = () => {
  return (
    <>
      <Helmet>
        <title>Premiações | Rafael Ferreira - MVP Azure, Alura Star, DevOps Ambassador</title>
        <meta
          name="description"
          content="Reconhecimentos e premiações recebidos por Rafael Ferreira: Microsoft MVP Azure 2025, Alura Star 2025, DevOps Institute Ambassador 2025 e Green Software Champion 2025. Profissional dedicado ao compartilhamento de conhecimento na comunidade tech."
        />
        <meta
          name="keywords"
          content="Rafael Ferreira, Microsoft MVP, MVP Azure, Alura Star, DevOps Institute Ambassador, Green Software Champion, premiações tech, reconhecimentos, comunidade tech, Azure, DevOps, sustentabilidade"
        />
        <meta property="og:title" content="Premiações | Rafael Ferreira" />
        <meta
          property="og:description"
          content="Quatro programas, um propósito: enaltecer quem compartilha conhecimento e fortalece a comunidade tech. Conheça as premiações de Rafael Ferreira."
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://orafaelferreira.com/premiacoes" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <Awards />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Premiacoes;
