import { Cloud, Code, TrendingUp, Lightbulb } from "lucide-react";
const About = () => {
  const skills = [{
    icon: Cloud,
    title: "Azure & Cloud",
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
    description: "Construção de plataformas internas e observabilidade"
  }];
  return <section id="about" className="py-20 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Sobre <span className="text-primary">mim</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Sou especialista em Cloud, DevOps e Engenharia de Plataforma, com foco profundo em{" "}
                <span className="text-foreground font-semibold">Azure</span>,{" "}
                <span className="text-foreground font-semibold">FinOps</span> e{" "}
                <span className="text-foreground font-semibold">Infrastructure as Code</span> (Terraform e Bicep).
              </p>
              <p>
                Minha missão é transformar ambientes complexos em plataformas resilientes, seguras e otimizadas,
                sempre com foco em automação, observabilidade e boas práticas de engenharia.
              </p>
              <p>
                Além da atuação técnica, sou palestrante ativo na comunidade, mentor de profissionais em transição
                de carreira e criador de conteúdo técnico para compartilhar conhecimento e experiências reais do dia a dia.
              </p>
              <p className="text-primary font-semibold italic text-xl mt-8">"Tecnologia é ponte, não barreira, e eu construo pontes todos os dias."</p>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
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