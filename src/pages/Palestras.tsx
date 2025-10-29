import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Talks from "@/components/Talks";
import Footer from "@/components/Footer";

const Palestras = () => {
  return (
    <>
      <Helmet>
        <title>Palestras - Rafael Martin</title>
        <meta name="description" content="Palestras e apresentações sobre Cloud, DevOps e Engenharia de Plataforma em eventos e comunidades técnicas." />
        <meta property="og:title" content="Palestras - Rafael Martin" />
        <meta property="og:description" content="Palestras sobre Cloud, DevOps e Engenharia de Plataforma." />
        <link rel="canonical" href="https://www.orafaelferreira.com/palestras" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Talks />
        <Footer />
      </div>
    </>
  );
};

export default Palestras;
