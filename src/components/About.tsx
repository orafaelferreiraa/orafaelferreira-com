import { Cloud, Code, TrendingUp, Lightbulb, Award, Users, Briefcase, Monitor } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
const About = () => {
  const highlights = [{
    icon: Award,
    title: "Experiência & Credenciais",
    description: "Mais de 10 anos em tecnologia, 19 certificações técnicas, formado em Ciência da Computação",
    details: "Microsoft MVP & MCT, DevOps Institute Ambassador, Alura Star, Green Software Champion"
  }, {
    icon: Briefcase,
    title: "Especialização Técnica",
    description: "Platform Engineer especializado em arquiteturas Azure e transformação digital",
    details: "Experiência em multinacionais, consultorias e ambientes corporativos internacionais"
  }, {
    icon: Monitor,
    title: "Stack de Ferramentas",
    description: "Azure | Terraform, Bicep, | Kubernetes, Docker",
    details: "CI/CD com GitHub Actions e Azure DevOps | GitOps | Observabilidade com Prometheus e Grafana"
  }, {
    icon: Users,
    title: "Comunidade & Conteúdo",
    description: "Palestrante ativo, mentor e criador de conteúdo técnico",
    details: "Organização de Comunidades Técnicas em Florianópolis | Podcast e conteúdo no YouTube e Spotify"
  }];
  const skills = [{
    icon: Cloud,
    title: "Cloud Azure",
    description: "Especialista em arquiteturas cloud resilientes e escaláveis"
  }, {
    icon: Code,
    title: "DevOps & IaC",
    description: "Automação com Terraform, Bicep e pipelines CI/CD"
  }, {
    icon: TrendingUp,
    title: "FinOps",
    description: "Otimização de custos e governança financeira em nuvem"
  }, {
    icon: Lightbulb,
    title: "Platform Engineering",
    description: "Construção de plataformas internas com observabilidade"
  }];
  return <section id="about" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Sobre <span className="text-primary">mim</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">Platform Engineer especializado em Cloud Azure e DevOps, com foco em transformação digital através de soluções inovadoras.</p>
            <p className="text-primary font-semibold italic text-lg">"Tecnologia é ponte, não barreira, e eu construo pontes todos os dias."</p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {highlights.map((highlight, index) => <Card key={highlight.title} className="group hover:border-primary/50 transition-all duration-300 animate-fade-in-up" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <CardContent className="p-6">
                  <highlight.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-heading font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-muted-foreground mb-3">{highlight.description}</p>
                  <Separator className="my-3" />
                  <p className="text-sm text-muted-foreground/80">{highlight.details}</p>
                </CardContent>
              </Card>)}
          </div>

          <Separator className="my-12" />

          {/* Skills Grid */}
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-heading font-bold">
              Áreas de <span className="text-primary">Especialização</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => <div key={skill.title} className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 animate-fade-in-up" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <skill.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-semibold mb-2">{skill.title}</h3>
                <p className="text-muted-foreground">{skill.description}</p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default About;