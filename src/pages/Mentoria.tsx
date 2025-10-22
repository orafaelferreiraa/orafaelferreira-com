import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Mentorship from "@/components/Mentorship";
import Footer from "@/components/Footer";

const Mentoria = () => {
  return (
    <>
      <Helmet>
        <title>Mentoria - Rafael Martin</title>
        <meta name="description" content="Mentoria Individual em Cloud e DevOps. Sessões personalizadas para profissionais que buscam evolução técnica e posicionamento no mercado." />
        <meta property="og:title" content="Mentoria - Rafael Martin" />
        <meta property="og:description" content="Mentoria Individual em Cloud e DevOps. Sessões personalizadas para evolução técnica." />
        <link rel="canonical" href="https://orafaelferreira.com/mentoria" />
      </Helmet>
      <div className="min-h-screen">
        <Navigation />
        <Mentorship />
        <Footer />
      </div>
    </>
  );
};

export default Mentoria;
