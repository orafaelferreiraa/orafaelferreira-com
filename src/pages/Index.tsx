import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Blog from "@/components/Blog";
import Talks from "@/components/Talks";
import Mentorship from "@/components/Mentorship";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Blog />
      <Talks />
      <Mentorship />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
