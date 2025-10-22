import { UserCheck, Target, Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Mentorship = () => {
  const benefits = [
    {
      icon: Target,
      title: "Orientação Personalizada",
      description: "Plano de desenvolvimento focado nos seus objetivos e necessidades específicas",
    },
    {
      icon: UserCheck,
      title: "Experiência Real",
      description: "Aprenda com cases práticos e desafios reais de ambientes de produção",
    },
    {
      icon: Rocket,
      title: "Aceleração de Carreira",
      description: "Acelere sua transição ou evolução em Cloud, DevOps e Platform Engineering",
    },
  ];

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="mentorship" className="py-20 lg:py-32 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
              Mentoria <span className="text-primary">Individual</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acelere sua jornada em Cloud e DevOps com orientação técnica personalizada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {benefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className="p-6 text-center hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </Card>
            ))}
          </div>

          <Card className="p-8 md:p-12 bg-gradient-to-br from-card to-secondary/30 border-primary/20 animate-fade-in">
            <div className="text-center space-y-6">
              <h3 className="text-2xl sm:text-3xl font-heading font-bold">
                Transforme sua carreira em Cloud & DevOps
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Mentorias individuais com foco em Azure, DevOps, FinOps, Infrastructure as Code e Platform Engineering.
                Ideal para profissionais em transição de carreira ou que buscam aprofundamento técnico em cloud.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button onClick={scrollToContact} size="lg" className="group">
                  Quero saber mais
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://www.linkedin.com/in/rafaelmartinferreira/" target="_blank" rel="noopener noreferrer">
                    Falar no LinkedIn
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Mentorship;
