import { ArrowDown, Linkedin, Github, Youtube, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/orafaelferreiraa/", label: "LinkedIn" },
    { icon: Github, href: "https://github.com/rafaelmartinferreira", label: "GitHub" },
    { icon: Youtube, href: "https://www.youtube.com/@rafaelmartinferreira", label: "YouTube" },
    { icon: Music, href: "https://open.spotify.com/show/lowopscast", label: "LowOpsCast" },
  ];

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="text-sm font-mono text-primary mb-2 block">Cloud & DevOps Specialist</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Rafael Martin
              <br />
              <span className="text-primary">Alves Ferreira</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
              Transformando ambientes em nuvem em plataformas resilientes e seguras.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  asChild
                  className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    <social.icon className="h-5 w-5" />
                  </a>
                </Button>
              ))}
            </div>
            
            <div>
              <Button onClick={scrollToAbout} size="lg" className="group">
                Saiba mais
                <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center lg:justify-end animate-fade-in-up">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl animate-glow" />
              <img
                src={heroImage}
                alt="Rafael Martin Alves Ferreira"
                className="relative rounded-2xl w-full max-w-md lg:max-w-lg shadow-2xl border border-border"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-primary" />
      </div>
    </section>
  );
};

export default Hero;
