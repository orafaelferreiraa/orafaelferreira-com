import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Play, Headphones, ArrowUpRight, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface RecommendationItem {
  name: string;
  url: string;
  highlight?: boolean;
}

const trainingPlatforms: RecommendationItem[] = [
  { name: "TFTEC", url: "https://www.tftec.com.br" },
  { name: "DevOpsPro", url: "https://curso.devopspro.com.br/" },
  { name: "Linuxtips", url: "https://www.linuxtips.io/" },
  { name: "Udemy", url: "https://www.udemy.com/" },
  { name: "KodeKloud", url: "https://kodekloud.com/" },
  { name: "Alura", url: "https://www.alura.com.br/promocao/awin_10EstudeAlurax",}
];

const youtubeChannels: RecommendationItem[] = [
  { name: "LowOps Channel", url: "https://www.youtube.com/@LowOps", highlight: true },
  { name: "Fabricio Veronez", url: "https://www.youtube.com/@fabricioveronez" },
  { name: "LINUXtips", url: "https://www.youtube.com/@LinuxTips" },
  { name: "Raphael Andrade", url: "https://www.youtube.com/@RaphaelAndrade" },
  { name: "D.E.P.L.O.Y", url: "https://www.youtube.com/@D.E.P.L.O.Y" },
  { name: "Azure Floripa", url: "https://www.youtube.com/@AzureFloripa" },
  { name: "John Savill's Technical Training", url: "https://www.youtube.com/@NTFAQGuy" },
  { name: "DOUGBR - DevOps User Group Brazil", url: "https://www.youtube.com/@dougbrazil" },
  { name: "IT LifeHacks - Edesan Tomaz", url: "https://www.youtube.com/@ITLifeHacks" },
  { name: "Canal Marcus Vinicius", url: "https://www.youtube.com/@canalmarcusvinicius/videos" },
  { name: "TecMundo", url: "https://www.youtube.com/@tecmundo" },
  { name: "Seja Uma Pessoa Melhor", url: "https://www.youtube.com/@sejaumapessoamelhor" },
  { name: "Marcos Strider", url: "https://www.youtube.com/@marcostrider" },
  { name: "El Professor da Oratoria", url: "https://www.youtube.com/@elprofessordaoratoria" }
];

const spotifyPodcasts: RecommendationItem[] = [
  { name: "LowOpsCast", url: "https://open.spotify.com/show/0U4kcZT2Cwn4CqQGg4Ywcj?si=1d9848b7fedd4059", highlight: true },
  { name: "Kubicast", url: "https://open.spotify.com/show/7x2OHOUAaOnTjlSwBHNAjN?si=1c30528ecfd9400f" },
  { name: "IA Sob Controle", url: "https://open.spotify.com/show/5xLCMHJ6eGWzdu8JaIDkuP?si=c83cf258eb0847b8" },
  { name: "Hipster Ponto Tech", url: "https://open.spotify.com/show/2p0Vx75OmfsXktyLBuLuSf?si=fbce32599acd44c3" },
  { name: "Dev Sem Fronteiras", url: "https://open.spotify.com/show/3WsvUbTh7M1Rsw6lOGwYtk?si=9c76e2b7a02b43e9" },
  { name: "Learn English", url: "https://open.spotify.com/show/74wYLV01Ei5ahb232XzJNf?si=56097bae33864858" },
  { name: "English in Brazil", url: "https://open.spotify.com/show/0LZHZHWjUddEvNaY3NM98q?si=34dd2ab094774be2" },
  { name: "Tech Lead Journal", url: "https://open.spotify.com/show/5suS91H6OfqDt14ZsOD4RV?si=8f4e0ac6288349d32" },
  { name: "PrimoCast", url: "https://open.spotify.com/show/2gCj9YG9tjMexhS4pIlRHo?si=4532e82b82bc4744" },
  { name: "Como Voce fez isso?", url: "https://open.spotify.com/show/1QJgd5aW274UcsHAShJwSE?si=00d204329ef74598" }
];

interface CategorySection {
  id: string;
  titleKey: string;
  icon: React.ElementType;
  gradient: string;
  items: RecommendationItem[];
}

const categories: CategorySection[] = [
  {
    id: "training",
    titleKey: "recommendations.trainingPlatforms",
    icon: GraduationCap,
    gradient: "from-blue-500 to-cyan-500",
    items: trainingPlatforms,
  },
  {
    id: "youtube",
    titleKey: "recommendations.youtubeChannels",
    icon: Play,
    gradient: "from-red-500 to-rose-500",
    items: youtubeChannels,
  },
  {
    id: "podcasts",
    titleKey: "recommendations.spotifyPodcasts",
    icon: Headphones,
    gradient: "from-green-500 to-emerald-500",
    items: spotifyPodcasts,
  },
];

const Recommendations = () => {
  const { t } = useTranslation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.05 });

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
              {t("recommendations.title")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {t("recommendations.description")}
            </p>
          </div>

          {/* Categories */}
          <div ref={contentRef} className="space-y-16">
            {categories.map((category, categoryIndex) => (
              <div
                key={category.id}
                className={`scroll-fade-in ${contentVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${categoryIndex * 150}ms` }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-br ${category.gradient} text-white shadow-lg`}
                  >
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold">
                    {t(category.titleKey)}
                  </h2>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <Card
                        className={`relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-[0_4px_24px_hsl(180_100%_50%/0.08)] hover:-translate-y-0.5 border border-primary/10 bg-card/40 backdrop-blur-sm ${
                          item.highlight
                            ? "border-primary/30 bg-primary/5"
                            : "hover:border-primary/25"
                        }`}
                      >
                        {/* Top gradient bar */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                        />

                        <CardContent className="p-4 flex items-center gap-3">
                          {/* Color indicator */}
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-br ${category.gradient} opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all`}
                          />

                          {/* Name */}
                          <span className="font-medium flex-1 group-hover:text-primary transition-colors truncate">
                            {item.name}
                          </span>

                          {/* Highlight star */}
                          {item.highlight && (
                            <Star className="h-4 w-4 text-primary fill-primary" />
                          )}

                          {/* Arrow */}
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
