import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Blog = () => {
  const posts = [
    {
      title: "Azure Backup should be enabled for Virtual Machines",
      excerpt: "Visão Geral sobre Azure Backup e como implementar políticas de backup para máquinas virtuais no Azure.",
      date: "2025-06-30",
      category: "Azure",
      readTime: "8 min",
      url: "https://orafaelferreiraa.medium.com/azure-backup-should-be-enabled-for-virtual-machines-3ced54449178"
    },
    {
      title: "O que é Azure Policy? Uma Visão Completa",
      excerpt: "O Azure Policy é um recurso da Microsoft Azure que ajuda organizações a implementar governança e compliance de forma automatizada e em escala.",
      date: "2025-01-11",
      category: "Azure",
      readTime: "10 min",
      url: "https://orafaelferreiraa.medium.com/o-que-%C3%A9-azure-policy-uma-vis%C3%A3o-completa-d51a274679d4"
    },
    {
      title: "Automatizando Infraestrutura Moderna com Metodologias Ágeis",
      excerpt: "No mundo altamente competitivo em todas as áreas (iremos focar na tecnologia), a agilidade tornou-se uma característica indispensável.",
      date: "2024-10-29",
      category: "DevOps",
      readTime: "12 min",
      url: "https://orafaelferreiraa.medium.com/automatizando-infraestrutura-moderna-com-metodologias-%C3%A1geis-a89cccade631"
    },
    {
      title: "Explorando a Inteligência Artificial Generativa",
      excerpt: "Uma introdução completa sobre Inteligência Artificial Generativa e suas aplicações práticas no mundo moderno.",
      date: "2024-09-15",
      category: "IA",
      readTime: "10 min",
      url: "https://orafaelferreiraa.medium.com/explorando-a-intelig%C3%AAncia-artificial-generativa-154bd7aa96cf"
    },
    {
      title: "Estratégias de Modernização de Aplicações: Aplicando os 6Rs com o Cloud Adoption Framework",
      excerpt: "Entenda as estratégias de modernização de aplicações utilizando o framework de adoção da nuvem e os 6Rs.",
      date: "2024-08-22",
      category: "Cloud",
      readTime: "15 min",
      url: "https://orafaelferreiraa.medium.com/estrat%C3%A9gias-de-moderniza%C3%A7%C3%A3o-de-aplica%C3%A7%C3%B5es-aplicando-os-6rs-com-o-cloud-adoption-framework-01ad6bf88ed8"
    },
    {
      title: "Utilizando Azure Workbooks para Otimização de Custos com FinOps",
      excerpt: "Como utilizar Azure Workbooks para criar dashboards de otimização de custos seguindo práticas de FinOps.",
      date: "2024-08-04",
      category: "FinOps",
      readTime: "12 min",
      url: "https://orafaelferreiraa.medium.com/utilizando-azure-workbooks-para-otimiza%C3%A7%C3%A3o-de-custos-com-finops-f38bdcb4bb77"
    },
    {
      title: "Guia de Criação de Máquinas Virtuais no Microsoft Azure",
      excerpt: "Um guia completo e prático sobre como criar e gerenciar máquinas virtuais no Microsoft Azure.",
      date: "2024-07-26",
      category: "Azure",
      readTime: "10 min",
      url: "https://orafaelferreiraa.medium.com/guia-de-cria%C3%A7%C3%A3o-de-maquinas-virtuais-no-microsoft-azure-9c2ecf5c205e"
    },
    {
      title: "Antes do Cloud Native: Construindo uma Fundação Sólida para a Nuvem",
      excerpt: "Entenda os fundamentos necessários antes de adotar arquiteturas Cloud Native e como preparar sua infraestrutura.",
      date: "2024-07-14",
      category: "Cloud",
      readTime: "14 min",
      url: "https://orafaelferreiraa.medium.com/antes-do-cloud-native-construindo-uma-funda%C3%A7%C3%A3o-s%C3%B3lida-para-a-nuvem-impactando-um-futuro-b6cbafef029b"
    },
    {
      title: "Construindo uma Fundação Sólida para a Nuvem: Monitoria e Observabilidade",
      excerpt: "Como implementar monitoria e observabilidade efetivas para garantir performance e confiabilidade em ambientes cloud.",
      date: "2024-07-14",
      category: "Observabilidade",
      readTime: "13 min",
      url: "https://orafaelferreiraa.medium.com/construindo-uma-funda%C3%A7%C3%A3o-s%C3%B3lida-para-a-nuvem-monitoria-e-observabilidade-para-performance-e-2e39c332b35b"
    },
    {
      title: "Construindo uma Fundação Sólida para a Nuvem com FinOps",
      excerpt: "Aprenda a maximizar os custos em ambientes cloud utilizando práticas de FinOps e construindo uma fundação sólida.",
      date: "2024-07-14",
      category: "FinOps",
      readTime: "12 min",
      url: "https://orafaelferreiraa.medium.com/construindo-uma-funda%C3%A7%C3%A3o-s%C3%B3lida-para-a-nuvem-com-finops-maximizando-os-custos-em-ambientes-cloud-0b47af9ce8a0"
    },
  ];

  return (
    <section id="blog" className="py-20 lg:py-32 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold mb-4">
            <span className="text-primary">Artigos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conteúdo técnico sobre Cloud, DevOps e Platform Engineering
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {posts.map((post, index) => (
            <Card
              key={post.title}
              className="group overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {post.category}
                  </span>
                  <span className="text-muted-foreground">{post.readTime}</span>
                </div>

                <h3 className="text-xl font-heading font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.date).toLocaleDateString("pt-BR")}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="group/btn"
                    asChild
                  >
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      Ler mais
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="group" asChild>
            <a href="https://orafaelferreiraa.medium.com/" target="_blank" rel="noopener noreferrer">
              Ver todos os artigos
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Blog;
