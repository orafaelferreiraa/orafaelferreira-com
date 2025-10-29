import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Rafael Martin - Cloud & DevOps Engineer</title>
        <meta name="description" content="Engenheiro DevOps especializado em Cloud e Platform Engineering. Microsoft MVP & MCT, DevOps Institute Ambassador, Alura Star. Mais de 10 anos em tecnologia, 19 certificações técnicas em Azure, DevOps, FinOps e Engenharia de Plataforma." />
        <meta property="og:title" content="Rafael Martin - Cloud & DevOps Engineer" />
        <meta property="og:description" content="Especialista em Azure, DevOps, FinOps e Engenharia de Plataforma. Transformando ambientes em nuvem em plataformas resilientes e seguras." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.orafaelferreira.com/" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <About />
        <Footer />
      </div>
    </>
  );
};

export default Home;
