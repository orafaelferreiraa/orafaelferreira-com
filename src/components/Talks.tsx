import { Presentation, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Talks = () => {
  const talks = [
    {
      title: "Platform Engineering: O Futuro do DevOps",
      event: "DevOps Summit Brasil",
      date: "2025-04-20",
      type: "Keynote",
      location: "São Paulo, SP",
      slidesUrl: "#",
      videoUrl: "#",
    },
    {
      title: "FinOps na Prática: Reduzindo Custos em 40%",
      event: "Azure Day",
      date: "2025-03-10",
      type: "Palestra",
      location: "Rio de Janeiro, RJ",
      slidesUrl: "#",
    },
    {
      title: "IaC com Terraform: Além do Básico",
      event: "Cloud Native Community",
      date: "2025-01-25",
      type: "Workshop",
      location: "Online",
      slidesUrl: "#",
      videoUrl: "#",
    },
    {
      title: "Observabilidade: Logs, Métricas e Traces",
      event: "Tech Week",
      date: "2024-11-15",
      type: "Palestra",
      location: "Belo Horizonte, MG",
      slidesUrl: "#",
      videoUrl: "#",
    },
  ];

  return (
    <section id="talks" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Palestras & <span className="text-primary">Talks</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compartilhando conhecimento e experiências com a comunidade técnica
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {talks.map((talk, index) => (
            <Card
              key={talk.title}
              className="group p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Presentation className="h-6 w-6" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-secondary text-secondary-foreground">
                      {talk.type}
                    </span>
                    <span className="text-sm text-muted-foreground">{talk.location}</span>
                  </div>

                  <h3 className="text-lg font-heading font-semibold group-hover:text-primary transition-colors">
                    {talk.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">{talk.event}</p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(talk.date).toLocaleDateString("pt-BR")}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {talk.slidesUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={talk.slidesUrl} target="_blank" rel="noopener noreferrer">
                          Slides
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                    {talk.videoUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={talk.videoUrl} target="_blank" rel="noopener noreferrer">
                          Vídeo
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Talks;
