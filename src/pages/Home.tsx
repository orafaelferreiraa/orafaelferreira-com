import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Rafael Martin - Cloud & DevOps Engineer</title>
        <meta name="description" content="Transformando ambientes em nuvem em plataformas resilientes e seguras. Especialista em Azure, DevOps, FinOps e Engenharia de Plataforma." />
        <meta property="og:title" content="Rafael Martin - Cloud & DevOps Engineer" />
        <meta property="og:description" content="Transformando ambientes em nuvem em plataformas resilientes e seguras." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://orafaelferreira.com/" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <Footer />
      </div>
    </>
  );
};

export default Home;
