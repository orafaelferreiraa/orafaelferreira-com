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
                Com <span className="text-foreground font-semibold">mais de uma década de experiência em tecnologia</span>,{" "}
                <span className="text-foreground font-semibold">19 certificações técnicas</span> e formação em{" "}
                <span className="text-foreground font-semibold">Ciência da Computação</span>, atuo como Engenheiro DevOps 
                especializado em arquiteturas em nuvem Azure. Atualmente sou{" "}
                <span className="text-foreground font-semibold">Microsoft MVP</span> (Microsoft Most Valuable Professional) &{" "}
                <span className="text-foreground font-semibold">MCT</span> (Microsoft Certified Trainer),{" "}
                <span className="text-foreground font-semibold">DevOps Institute Ambassador</span>,{" "}
                <span className="text-foreground font-semibold">Alura Star</span> e{" "}
                <span className="text-foreground font-semibold">Green Software Champion</span>.
              </p>
              <p>
                Minha trajetória inclui experiência em empresas multinacionais, consultorias e ambientes corporativos internacionais. 
                Nos últimos três anos, foquei intensamente em tecnologias de nuvem e DevOps, especializando-me em{" "}
                <span className="text-foreground font-semibold">Microsoft Azure</span>,{" "}
                <span className="text-foreground font-semibold">Azure DevOps</span>,{" "}
                <span className="text-foreground font-semibold">Terraform</span> e{" "}
                <span className="text-foreground font-semibold">Kubernetes</span>. 
                Essa jornada me apresentou novas oportunidades e desafios fundamentais para meu crescimento profissional.
              </p>
              <p>
                Minha caixa de ferramentas abrange plataformas de nuvem como <span className="text-foreground font-semibold">AWS</span>,{" "}
                <span className="text-foreground font-semibold">Azure</span> e{" "}
                <span className="text-foreground font-semibold">OCI</span>. Para automação de pipelines CI/CD, utilizo{" "}
                <span className="text-foreground font-semibold">Azure DevOps</span>,{" "}
                <span className="text-foreground font-semibold">GitLab</span>,{" "}
                <span className="text-foreground font-semibold">Jenkins</span> e{" "}
                <span className="text-foreground font-semibold">GitHub Actions</span>. 
                Na infraestrutura como código, trabalho com <span className="text-foreground font-semibold">Terraform</span>,{" "}
                <span className="text-foreground font-semibold">Bicep</span> e{" "}
                <span className="text-foreground font-semibold">Ansible</span>. 
                Para orquestração de microserviços, <span className="text-foreground font-semibold">Docker</span> e{" "}
                <span className="text-foreground font-semibold">Kubernetes</span> são minhas escolhas principais. 
                Utilizo <span className="text-foreground font-semibold">GitOps</span> com{" "}
                <span className="text-foreground font-semibold">ArgoCD</span>, e tenho experiência sólida em sistemas{" "}
                <span className="text-foreground font-semibold">Windows</span> e{" "}
                <span className="text-foreground font-semibold">Linux</span>, 
                além de habilidades em <span className="text-foreground font-semibold">Python</span> e{" "}
                <span className="text-foreground font-semibold">PowerShell</span>.
              </p>
              <p>
                Possuo expertise em monitoramento e observabilidade utilizando{" "}
                <span className="text-foreground font-semibold">Prometheus</span>,{" "}
                <span className="text-foreground font-semibold">Grafana</span>,{" "}
                <span className="text-foreground font-semibold">Zabbix</span> e{" "}
                <span className="text-foreground font-semibold">Datadog</span>. 
                Meu compromisso é entregar soluções eficazes, modernas e alinhadas às melhores práticas do setor, 
                contribuindo para um mundo mais conectado e inovador.
              </p>
              <p>
                Além da atuação técnica, sou palestrante ativo e faço parte da organização da{" "}
                <span className="text-foreground font-semibold">comunidade Azure Floripa</span>, 
                onde ajudamos a disseminar e aprofundar o entendimento sobre soluções cloud. 
                Também sou mentor de profissionais em transição de carreira e criador de conteúdo técnico no{" "}
                <span className="text-foreground font-semibold">YouTube</span> e{" "}
                <span className="text-foreground font-semibold">Spotify</span>, 
                compartilhando conhecimento e experiências reais do dia a dia.
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