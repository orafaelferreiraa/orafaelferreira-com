import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Youtube, Music } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RecommendationItem {
  name: string;
  url: string;
}

const trainingPlatforms: RecommendationItem[] = [
  { name: "TFTEC", url: "https://www.tftec.com.br" },
  { name: "DevOpsPro", url: "https://curso.devopspro.com.br/" },
  { name: "Linuxtips", url: "https://www.linuxtips.io/" },
  { name: "Udemy", url: "https://www.udemy.com/" }
];

const youtubeChannels: RecommendationItem[] = [
  { name: "LowOps Channel", url: "https://www.youtube.com/@LowOps-Channel" },
  { name: "Fabricio Veronez", url: "https://www.youtube.com/@fabricioveronez" },
  { name: "LINUXtips", url: "https://www.youtube.com/@LinuxTips" },
  { name: "Raphael Andrade", url: "https://www.youtube.com/@RaphaelAndrade" },
  { name: "D.E.P.L.O.Y", url: "https://www.youtube.com/@D.E.P.L.O.Y" },
  { name: "Azure Floripa", url: "https://www.youtube.com/@AzureFloripa" },
  { name: "John Savill's Technical Training", url: "https://www.youtube.com/@NTFAQGuy" },
  { name: "DOUGBR - DevOps User Group Brazil", url: "https://www.youtube.com/@dougbrazil" },
  { name: "IT LifeHacks - Edesan Tomaz ☁️", url: "https://www.youtube.com/@ITLifeHacks" },
  { name: "Canal Marcus Vinícius", url: "https://www.youtube.com/@canalmarcusvinicius/videos" },
  { name: "TecMundo", url: "https://www.youtube.com/@tecmundo" },
  { name: "Seja Uma Pessoa Melhor", url: "https://www.youtube.com/@sejaumapessoamelhor" },
  { name: "Marcos Strider", url: "https://www.youtube.com/@marcostrider" },
  { name: "El Professor da Oratória", url: "https://www.youtube.com/@elprofessordaoratoria" }
];

const spotifyPodcasts: RecommendationItem[] = [
  { name: "LowOpsCast", url: "https://open.spotify.com/show/0U4kcZT2Cwn4CqQGg4Ywcj?si=1d9848b7fedd4059" },
  { name: "Kubicast", url: "https://open.spotify.com/show/7x2OHOUAaOnTjlSwBHNAjN?si=1c30528ecfd9400f" },
  { name: "IA Sob Controle", url: "https://open.spotify.com/show/5xLCMHJ6eGWzdu8JaIDkuP?si=c83cf258eb0847b8" },
  { name: "Hipster Ponto Tech", url: "https://open.spotify.com/show/2p0Vx75OmfsXktyLBuLuSf?si=fbce32599acd44c3" },
  { name: "Dev Sem Fronteiras", url: "https://open.spotify.com/show/3WsvUbTh7M1Rsw6lOGwYtk?si=9c76e2b7a02b43e9" },
  { name: "Learn English", url: "https://open.spotify.com/show/74wYLV01Ei5ahb232XzJNf?si=56097bae33864858" },
  { name: "English in Brazil", url: "https://open.spotify.com/show/0LZHZHWjUddEvNaY3NM98q?si=34dd2ab094774be2" },
  { name: "Tech Lead Journal", url: "https://open.spotify.com/show/5suS91H6OfqDt14ZsOD4RV?si=8f4e0ac6288349d32" },
  { name: "PrimoCast", url: "https://open.spotify.com/show/2gCj9YG9tjMexhS4pIlRHo?si=4532e82b82bc4744" },
  { name: "Como Você fez isso?", url: "https://open.spotify.com/show/1QJgd5aW274UcsHAShJwSE?si=00d204329ef74598" }
];

const Recommendations = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Recomendações
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
            Nesta página, compartilho com vocês algumas das plataformas de cursos online, canais do YouTube e podcasts que têm 
            contribuído significativamente para o meu aprendizado e desenvolvimento pessoal e profissional.
          </p>
        </div>

        <Separator className="mb-12" />

        {/* Plataformas de Treinamentos Online */}
        <div className="mb-12 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <ExternalLink className="h-6 w-6 text-primary" />
                Plataformas de Treinamentos Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainingPlatforms.map((platform, index) => (
                  <a
                    key={index}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-all group"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {platform.name}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canais do YouTube */}
        <div className="mb-12 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Youtube className="h-6 w-6 text-primary" />
                Canais do YouTube
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {youtubeChannels.map((channel, index) => (
                  <a
                    key={index}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-all group"
                  >
                    <Youtube className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {channel.name}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Podcasts no Spotify */}
        <div className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Music className="h-6 w-6 text-primary" />
                Podcasts no Spotify
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {spotifyPodcasts.map((podcast, index) => (
                  <a
                    key={index}
                    href={podcast.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-all group"
                  >
                    <Music className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {podcast.name}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
