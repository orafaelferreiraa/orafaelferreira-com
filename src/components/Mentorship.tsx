import { 
  UserCheck, 
  Target, 
  Rocket, 
  ArrowRight, 
  Award, 
  Globe, 
  TrendingUp,
  CheckCircle2,
  Clock,
  FileCheck,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const Mentorship = () => {
  const mentorHighlights = [
    {
      icon: Briefcase,
      text: "Experiência de +10 anos em projetos de tecnologia, incluindo multinacionais e ambientes enterprise",
      link: "https://orafaelferreira.com/experiencias/"
    },
    {
      icon: Globe,
      text: "Atuação Global como Senior Azure DevOps Solution Engineer em empresa americana"
    },
    {
      icon: Award,
      text: "Formação em Ciência da Computação e +18 certificações técnicas relevantes",
      link: "https://orafaelferreira.com/certificacoes/"
    },
    {
      icon: Award,
      text: "Microsoft MVP e Microsoft Certified Trainer (MCT)",
      link: "https://mvp.microsoft.com/pt-BR/mvp/profile/627d5ac9-f704-4768-81a7-5c580283881d"
    },
    {
      icon: Globe,
      text: "DevOps Institute Ambassador - reconhecido internacionalmente",
      link: "https://stoblobcertificados011.blob.core.windows.net/certificados/2025-05-DevOpsInstituteAmbassadors.pdf"
    },
    {
      icon: Award,
      text: "Alura Star - embaixador oficial do programa",
      link: "https://www.alura.com.br/stars"
    },
    {
      icon: Globe,
      text: "Green Software Champion pela Green Software Foundation",
      link: "https://champions.greensoftware.foundation/champions/rafael-ferreira/"
    },
    {
      icon: TrendingUp,
      text: "Palestrante ativo e organizador dos grupos Azure Floripa, DevOpsDays Floripa e CNCF SC",
      link: "https://orafaelferreira.com/palestras/"
    }
  ];

  const mentorshipBenefits = [
    {
      icon: Target,
      title: "Orientação 100% Personalizada",
      description: "Sessões adaptadas às suas necessidades e objetivos. Para iniciantes ou profissionais sênior."
    },
    {
      icon: FileCheck,
      title: "Plano Personalizado",
      description: "Roteiro prático com próximos passos concretos. Saiba exatamente em que focar nas próximas semanas."
    },
    {
      icon: Rocket,
      title: "Dicas Valiosas",
      description: "Recomendações de cursos, comunidades, ferramentas e formas de ganhar experiência prática."
    },
    {
      icon: TrendingUp,
      title: "Visão Estratégica",
      description: "Entenda tendências e demandas atuais em Cloud Computing e DevOps."
    },
    {
      icon: CheckCircle2,
      title: "Confiança para Evoluir",
      description: "Valide suas ideias e ganhe segurança para executar o plano e buscar oportunidades."
    },
    {
      icon: UserCheck,
      title: "Grupo Exclusivo de Vagas",
      description: "Acesso ao grupo particular com vagas que recebo direto pelo LinkedIn, com recomendação direta ao recrutador."
    }
  ];

  const howItWorks = [
    {
      icon: FileCheck,
      title: "Pré-call Personalizado",
      description: "Preencha um formulário descrevendo seu momento profissional, experiências e metas em Cloud/DevOps."
    },
    {
      icon: Clock,
      title: "Call Estratégica (1h a 1h30)",
      description: "Sessão prática e direta ao ponto, esclarecendo dúvidas e criando um roteiro realista e eficiente."
    },
    {
      icon: CheckCircle2,
      title: "Plano de Ação Personalizado",
      description: "Saia com passos claros: estudos, certificações, dicas de experiência prática e posicionamento no mercado."
    }
  ];

  const services = [
    { name: "Mentoria Cloud Azure e DevOps Individual", price: "R$ 1.000" },
    { name: "Revisão de Perfil no LinkedIn", price: "R$ 200" },
    { name: "Template", price: "R$ 50" },
    { name: "Combo Completo (todos os 3 serviços)", price: "R$ 1.250 → R$ 890" }
  ];

  const discountsByProfile = [
    { profile: "Open to Work (40% off)", mentorship: "R$ 600", linkedin: "R$ 120", template: "R$ 30", total: "R$ 750" },
    { profile: "Júnior (30% off)", mentorship: "R$ 700", linkedin: "R$ 140", template: "R$ 35", total: "R$ 875" },
    { profile: "Pleno (20% off)", mentorship: "R$ 800", linkedin: "R$ 160", template: "R$ 40", total: "R$ 1.000" },
    { profile: "Sênior (10% off)", mentorship: "R$ 900", linkedin: "R$ 180", template: "R$ 45", total: "R$ 1.125" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-card/50 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Mentoria em <span className="text-primary">Cloud Azure e DevOps</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8">
              Você trabalha com TI (seja iniciante ou experiente) e quer crescer na área de Cloud Azure e DevOps, mas sente dificuldade em encontrar um caminho claro?
            </p>
            <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8">
              Seja você um iniciante buscando começar ou um profissional com alguma experiência e não tem certeza de qual caminho seguir? Eu entendo exatamente como é frustrante estudar, se esforçar e não ter resultados claros. Uma mentoria 1:1 focada e personalizada pode ser o que faltava.
            </p>
            <p className="text-base lg:text-lg font-medium leading-relaxed mb-8">
              O mercado está aquecido, mas somente aqueles com clareza estratégica conseguem se destacar, ter reconhecimento e salários melhores. Minha mentoria existe justamente para resolver isso. Irei te ajudar a traçar um plano concreto de evolução na área de Cloud e DevOps.
            </p>
            <Card className="p-6 bg-primary/5 border-primary/20">
              <p className="text-base lg:text-lg font-semibold">
                Essa mentoria é pra você que está cansado de procurar vagas. Deixe que as vagas e os recrutadores procurem por você. Torne-se uma referência na sua área, seja reconhecido no mercado e faça com que recrutadores e profissionais de alta relevância desejem trabalhar com você.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Por que me escolher Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-center mb-12">
              Por que me escolher como <span className="text-primary">mentor?</span>
            </h2>

            <p className="text-lg text-muted-foreground text-center mb-12 leading-relaxed">
              Reúno experiências sólidas que me posicionam como referência no setor de Cloud e DevOps. Alguns destaques da minha trajetória profissional incluem:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentorHighlights.map((highlight, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 rounded-full bg-primary/10">
                      <highlight.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      {highlight.link ? (
                        <a 
                          href={highlight.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-primary transition-colors"
                        >
                          <p className="text-sm leading-relaxed">{highlight.text}</p>
                        </a>
                      ) : (
                        <p className="text-sm leading-relaxed">{highlight.text}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-6 mt-8 bg-secondary/30">
              <p className="text-sm leading-relaxed">
                <strong>Domínio Tecnológico:</strong> Profundo conhecimento em Microsoft Azure, Azure DevOps, IAC, GitHub Actions, entre outras ferramentas de ponta amplamente usadas no setor.
              </p>
              <Separator className="my-4" />
              <p className="text-sm leading-relaxed">
                <strong>Metodologias Modernas:</strong> Aplicação das principais práticas do mundo DevOps e Cloud, incluindo FinOps, pipelines de CI/CD, GitOps, Containers/Kubernetes, observabilidade de sistemas e automação de infraestrutura com PowerShell e Python.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores Section */}
      <section className="py-16 lg:py-24 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-4">
              Valores
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              Conforme o seu nível de carreira. Confira os valores de cada serviço e os preços ajustados por perfil:
            </p>

            <Card className="mb-8 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Serviço</TableHead>
                    <TableHead className="font-bold text-right">Preço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="text-right">{service.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <h3 className="text-2xl font-heading font-bold text-center mb-8">
              Descontos por Perfil
            </h3>

            <Card className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Perfil</TableHead>
                    <TableHead className="font-bold text-right">Mentoria</TableHead>
                    <TableHead className="font-bold text-right">LinkedIn</TableHead>
                    <TableHead className="font-bold text-right">Currículo</TableHead>
                    <TableHead className="font-bold text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discountsByProfile.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.profile}</TableCell>
                      <TableCell className="text-right">{row.mentorship}</TableCell>
                      <TableCell className="text-right">{row.linkedin}</TableCell>
                      <TableCell className="text-right">{row.template}</TableCell>
                      <TableCell className="text-right font-bold">{row.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="mt-8 p-6 bg-primary/5 border-primary/20">
              <h4 className="font-heading font-bold text-lg mb-4">💳 Forma de Pagamento</h4>
              <p className="text-sm mb-4 leading-relaxed">
                O pagamento é realizado exclusivamente via PIX. Não é possível parcelar o valor dos serviços.
              </p>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-sm font-semibold mb-2">Comprovação obrigatória</p>
                <p className="text-sm leading-relaxed">
                  Para garantir seu desconto, preciso de um comprovante que mostre seu status atual — pode ser uma carteira de trabalho, print de vaga, oferta de emprego ou outro documento que ajude a validar.
                </p>
                <p className="text-sm font-bold mt-2">Sem comprovação, será aplicado o valor cheio.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Por que minha mentoria Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-12">
              🚀 Por que minha mentoria é exatamente o que você <span className="text-primary">precisa agora?</span>
            </h2>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                No mundo da tecnologia, surgem novas ferramentas, certificações e metodologias a todo momento. Fica difícil saber onde investir seu tempo e esforço. A minha mentoria Cloud Azure e DevOps individual oferece orientação sob medida: em vez de dicas genéricas, você recebe conselhos alinhados exatamente com seus objetivos e desafios.
              </p>
              
              <Card className="p-6 bg-secondary/30 border-primary/20">
                <p className="font-semibold text-foreground">
                  Um estudo da Harvard Business Review revelou que profissionais com mentoria recebem promoções cinco vezes mais frequentemente que aqueles sem mentores, avançando na carreira em média 18 meses mais rápido.
                </p>
              </Card>

              <p>
                Você pode tentar avançar sozinho com cursos online, faculdades ou pós-graduações. Claro, eventualmente, você chegará lá, mas qual é o preço que você está disposto a pagar pelo seu tempo? Você pode ir a pé para qualquer lugar ou pode escolher ir de carro, ônibus ou avião para chegar mais rápido.
              </p>

              <p className="font-semibold text-foreground">
                A mentoria Cloud Azure e DevOps individual é exatamente esse "avião": uma abordagem acelerada, direta e personalizada que te levará rapidamente ao resultado que você tanto deseja, com menos esforço, menos erros e resultados concretos.
              </p>

              <p>
                Pense comigo: o que são mil reais investidos em sua carreira se você conseguir dobrar ou multiplicar seu salário? O que isso representaria para você e para sua família? Lembre-se: eu já trilhei esse caminho, multipliquei meu salário em 20 vezes em menos de 4 anos. E você, está disposto a esperar quanto tempo para alcançar esses resultados?
              </p>

              <Card className="p-6 bg-destructive/10 border-destructive/30">
                <h4 className="font-heading font-bold text-lg mb-3 text-foreground">Mas atenção:</h4>
                <p className="text-sm">
                  Eu não farei o que cabe a você fazer. O sucesso é certo se você seguir o que for traçado, mas depende diretamente do seu comprometimento e esforço. Não haverá devolução, pois não posso garantir que você fará sua parte. Eu já fiz a minha, e estou aqui para ajudar você a transformar a sua vida e a da sua família, exatamente como transformei a minha.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Na minha mentoria você terá Section */}
      <section className="py-16 lg:py-24 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-12">
              🎯 Na minha mentoria Cloud Azure e DevOps individual você terá:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentorshipBenefits.map((benefit, index) => (
                <Card 
                  key={index} 
                  className="p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                >
                  <CardHeader className="p-0 mb-4">
                    <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3 w-fit">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-center mb-12">
              Como funciona minha mentoria Cloud Azure e DevOps individual:
            </h2>

            <div className="space-y-6">
              {howItWorks.map((step, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <step.icon className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-heading font-bold">{step.title}</h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      {index === 0 && (
                        <Button asChild className="mt-4" size="sm">
                          <a 
                            href="https://forms.office.com/r/SMNmt7bXwQ" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Fazer inscrição
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/10 to-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Pronto para mudar sua realidade financeira e profissional?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Não deixe sua evolução profissional no "piloto automático", com empresas e chefes te dizendo o que fazer. Assuma a responsabilidade e controle da sua carreira. Conte comigo para ter uma mudança valiosa rumo aos seus objetivos na nuvem.
            </p>
            <p className="text-lg font-semibold mb-8">
              Não perca essa oportunidade de evoluir de forma orientada e estratégica. Cloud e DevOps são o futuro da Tecnologia, torne-se também o profissional de ponta que o mercado procura! 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <a 
                  href="https://forms.office.com/r/SMNmt7bXwQ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Faça sua inscrição agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
              <a 
                href="https://www.linkedin.com/in/rafaelmartinferreira/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Fale comigo no LinkedIn
              </a>
            </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mentorship;
