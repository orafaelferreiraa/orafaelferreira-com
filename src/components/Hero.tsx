import { Linkedin, Github, Youtube, Music, Instagram, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-image.jpg";
const Hero = () => {
  const socialLinks = [{
    icon: Linkedin,
    href: "https://www.linkedin.com/in/orafaelferreiraa/",
    label: "LinkedIn",
    color: "text-blue-500"
  }, {
    icon: Github,
    href: "https://github.com/orafaelferreiraa",
    label: "GitHub",
    color: "text-foreground"
  }, {
    icon: Youtube,
    href: "https://www.youtube.com/@LowOps-Channel",
    label: "YouTube",
    color: "text-red-500"
  }, {
    icon: Music,
    href: "https://open.spotify.com/show/0U4kcZT2Cwn4CqQGg4Ywcj?si=77fbd9161ea246e6&nd=1&dlsi=6f57fcd882ad4cf8",
    label: "LowOpsCast",
    color: "text-green-500"
  }, {
    icon: Instagram,
    href: "https://www.instagram.com/rafaelmaferreira1/",
    label: "Instagram",
    color: "text-pink-500"
  }];

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };
  return <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="text-sm font-mono text-primary mb-2 block">Cloud & DevOps Especialista</span>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-3xl">
              {socialLinks.map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="group">
                  <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary">
                    <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                      <social.icon className={`h-8 w-8 ${social.color} transition-transform group-hover:scale-110`} />
                      <span className="text-sm font-medium text-center">{social.label}</span>
                    </CardContent>
                  </Card>
                </a>)}
            </div>

            {/* Scroll Down Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={scrollToAbout}
                className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Rolar para baixo"
              >
                <span className="text-sm font-medium">Saiba mais</span>
                <ChevronDown className="h-6 w-6 animate-bounce" />
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center lg:justify-end animate-fade-in-up">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl animate-glow" />
              <img src={heroImage} alt="Rafael Ferreira" className="relative rounded-2xl w-full max-w-md lg:max-w-lg shadow-2xl border border-border" />
            </div>
          </div>
        </div>
      </div>

    </section>;
};
export default Hero;