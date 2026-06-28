import { useEffect, useRef, useState } from "react";
import { Linkedin, Github, Youtube, Music, Instagram, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-image.jpg";
import heroImageOptimized from "@/assets/hero-image-optimized.webp";

const HERO_BLUR_PLACEHOLDER = "data:image/webp;base64,UklGRvYDAABXRUJQVlA4WAoAAAAgAAAAIwAALwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggCAIAADALAJ0BKiQAMAA+wVaiTaekoqIqtVqo8BgJbAC7MvCB6dXtxOeI03TebCvit12oUNiwx95znCoBZK9PZuHOrBNpwyFu+8iOiPXFifdDKMSOr2x8MUMxUYf23dPdM2NH4kAAAP6p7N06S8Bj1n19E45aalpBUpGr60/VyVlbf8Ei0Kl6Jj/jUD7v/B1FF+n0xG58MWvF+OOM6E/ZNjtbdjqdpEjIiaGrPOpHP6zHajCAiFtlYmu9JDkop8EtGC2HBqwbZ2fidOxCEqkk9jdGCe1A2n6vzZ3WIdnH8xeqI91Dizo035wRHNmMIUQtiEUYgza97QvyMlqGtZIeA9tunxmwqX2cHMWiwQ4h5Hqo1ECSCHc8YR5hZRmnPegXUL+F8eWNdJgkTi7hqXIwzn/4HYK8MQiewoCaY66XwoOwxbjhZ73y6Cb26tWf40fuEQ0ZdK7XDqDCL7J21GuM7DYfXczIr4L3rpLnUAJ1f0lCdHhNCNVlsfHC3/Bv6ER9WH9BTnnq/aHHuGBxGieMILc+9ODc0yx5v5AOEKDRMfVMZHlBo9Ds7TT1hdIujAuHTneCMnVmeKYJp6yGlDozfXTTdT5i8Jny5agbocobNpkBl4lkqG/8n7STM1NkK3tJssrFlQrtoCaLgcNb2arFUSp4pQcx9Diyp7yuE0nwAq32hl3xRZFO08BgAAA=";

const Hero = () => {
  const { t } = useTranslation();
  const [isHeroLoaded, setIsHeroLoaded] = useState(false);
  const heroImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (heroImgRef.current?.complete) {
      setIsHeroLoaded(true);
    }
  }, []);
  
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
    href: "https://www.youtube.com/@LowOps",
    label: "YouTube",
    color: "text-red-500"
  }, {
    icon: Music,
    href: "https://open.spotify.com/show/0U4kcZT2Cwn4CqQGg4Ywcj?si=77fbd9161ea246e6&nd=1&dlsi=6f57fcd882ad4cf8",
    label: "LowOpsCast",
    color: "text-green-500"
  }, {
    icon: Instagram,
    href: "https://www.instagram.com/orafaelferreira1/",
    label: "Instagram",
    color: "text-pink-500"
  }];
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in">
            <div className="inline-block">
              <span className="text-sm font-mono text-primary mb-2 block">{t("hero.title")}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight">
              Rafael Martin
              <br />
              <span className="text-primary">Alves Ferreira</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">{t("hero.description")}</p>
            
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
              <button onClick={scrollToAbout} className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors" aria-label={t("hero.learnMore")}>
                <span className="text-sm font-medium">{t("hero.learnMore")}</span>
                <ChevronDown className="h-6 w-6 animate-bounce" />
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl animate-glow" />
              <div
                className="relative rounded-2xl w-full max-w-md lg:max-w-lg shadow-2xl border border-border overflow-hidden"
                style={{
                  backgroundImage: isHeroLoaded ? 'none' : `url(${HERO_BLUR_PLACEHOLDER})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <picture>
                  <source srcSet={heroImageOptimized} type="image/webp" />
                  <img
                    ref={heroImgRef}
                    src={heroImage}
                    alt="Rafael Ferreira - Cloud & DevOps Specialist"
                    width={512}
                    height={512}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    sizes="(min-width: 1024px) 32rem, (min-width: 640px) 28rem, 90vw"
                    onLoad={() => setIsHeroLoaded(true)}
                    onError={() => setIsHeroLoaded(true)}
                    className={`relative w-full h-full object-cover transition-opacity duration-500 ${isHeroLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>;
};
export default Hero;