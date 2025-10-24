import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    title: "Senior Azure Platform Engineer",
    company: "Stefanini North America and APAC",
    period: "Jul 2025 - Present",
    description: "Atuo como Senior Azure Platform Engineer em um time global de Cloud & Infrastructure, com foco em Azure Enterprise-scale. Nosso desafio é criar, evoluir e sustentar uma plataforma escalável, padronizada e governada, garantindo que os times de desenvolvimento possam consumir recursos em nuvem de forma segura, eficiente e automatizada. Provisionamento e gestão de ambientes em larga escala utilizando Terraform Infrastructure as Code (IaC), assegurando padronização, imutabilidade e governança automatizada. Desenvolvimento e manutenção de pipelines CI/CD com GitHub Actions, viabilizando entregas ágeis, seguras e automatizadas em múltiplos ambientes. Implementação de soluções de Observabilidade & Monitoramento com Stack Kube-Prometheus (Prometheus e Grafana), configuração de alertas customizados, garantindo confiabilidade nos workloads críticos. Práticas de FinOps/Cloud Cost Optimization, otimizando ambientes, identificando recursos órfãos, explorando spot instances e aplicando estratégias de economia nos recursos superdimensionados, garantindo eficiência operacional e redução contínua de custos. Sustentação de clusters AKS, aplicando práticas de GitOps com ArgoCD e Helm Charts para provisionar uma plataforma resiliente e escalável de aplicações em contêiner. Implementação de estratégias de automação, padronização e melhoria contínua, buscando a eficiência, resiliência e governança dos clusters em ambientes críticos."
  },
  {
    title: "Senior Azure DevOps Solution Engineer",
    company: "Softensity Inc",
    period: "Dec 2024 - Jul 2025 (7 meses)",
    description: "Atuo em um time global de engenharia de plataforma com foco em Platform as a Product, em um dos maiores ambientes Microsoft em escala mundial. Estou alocado em um cliente multinacional do setor de auditoria (Big Four), trabalhando em um ecossistema Enterprise-scale de alta complexidade. Responsável por impulsionar a evolução, sustentação e governança de uma plataforma robusta e altamente padronizada, baseada em soluções PaaS e Serverless na Azure Cloud, que atende equipes técnicas distribuídas globalmente. Assegurando excelência operacional contínua, conformidade contínua e aderência às melhores práticas em Cloud Governance e Cloud Security. Minhas principais atividades incluem o desenvolvimento e gestão de infraestrutura utilizando Infrastructure as Code (IaC) com Bicep, garantindo escalabilidade, imutabilidade e padronização. Criação, otimização e manutenção de pipelines CI/CD com GitHub Actions, facilitando entregas ágeis, seguras e automatizadas desde o desenvolvimento até a produção. Definição e implementação de guardrails e políticas corporativas utilizando Azure Policy, RBAC e Blueprints, garantindo governança automatizada, conformidade contínua e redução de riscos. Automação de tarefas operacionais e administrativas com scripts PowerShell e Azure CLI, promovendo eficiência operacional e redução de erros humanos. Administração de complexa infraestrutura de rede corporativa, incluindo VNets, NSGs, VPN, Application Gateways, Azure Front Door, Private DNS e Private Endpoints. E Cloud Cost Optimization (FinOps), focadas na otimização contínua dos recursos e redução de custos operacionais."
  },
  {
    title: "Senior Azure DevOps Engineer",
    company: "CI&T",
    period: "Abr 2024 - Dec 2024 (8 meses)",
    description: "Atuei em um ambiente enterprise para um cliente global líder em food service, presente em mais de 90 países, por meio de uma empresa de consultoria, sendo responsável por construir e automatizar infraestruturas escaláveis e de alta disponibilidade na nuvem Azure, apoiando a migração de serviços do ambiente on-premise, que posteriormente serão modernizados para microserviços em contêineres. Em um ambiente com mais de 1.200 VMs e mais de 50 clusters distribuídos em mais de 100 assinaturas, é Azure Landing Zones e rede Hub-Spoke para garantir alta disponibilidade tanto na nuvem, ambiente híbrido (on-premise) com Azure Arc. Para o deployment e atualização das infraestruturas, é utilizado Terraform como IaC (Infrastructure as Code), assegurando a consistência e confiabilidade das configurações. Pipelines de CI/CD com GitHub Actions para automatizar deployments, garantindo a eficiência e qualidade das releases, tarefas pós-deployment com Jenkins. Gerenciamento de configuração de máquinas Linux com Puppet. No contexto do AKS (Azure Kubernetes Service), GitOps com FluxCD para o deploy de componentes nos clusters, Helm Charts para facilitar e padronizar o deployment de aplicações. Monitoramento e a observabilidade do ambiente utilizando Grafana, Prometheus e Splunk. Atualizo módulos e códigos dos componentes nos repositórios GitHub e Bitbucket para manter a integridade e precisão das informações. Conduzo Provas de Conceito (PoCs) para avaliar novas tecnologias e soluções, propondo melhorias contínuas e adotando as melhores ferramentas do mercado, incluindo práticas de FinOps, para otimizar custos e eficiência no ambiente em nuvem."
  },
  {
    title: "Engenheiro de Plataforma Azure Senior",
    company: "CI&T",
    period: "Set 2023 - Mar 2024 (6 meses)",
    description: "Diante do desafio de reestruturar o ambiente Cloud Azure em escala enterprise para uma das maiores empresas globais de telecomunicações, visando escalabilidade, eficiência operacional e a segurança. Realizei análises detalhadas, para padronização de arquiteturas de referência, e atuei como consultor estratégico na elaboração da documentação para migrações de aplicativos para a nuvem, fundamentada em designs de arquiteturas landing zones e redes hub-spoke, com auxilio dos frameworks como Cloud Adoption Framework (CAF) e Well-Architected foi possível habilitar arquiteturas robustas. Elaborei documentações técnicas, orientei sobre a escolha de recursos e decisões estratégias de backlog. Implementação de práticas de FinOps para equilibrar desempenho x custos. Contribuí na criação de uma plataforma para padronizar e otimizar a experiência do desenvolvedor (DevEx), integrando ferramentas como Backstage para construir catálogos de produtos, provisionamento de recursos com Terraform em pipelines CI/CD do Azure DevOps, garantindo um processo de entrega contínua e automatizada Minhas ações resultaram em melhorias significativas de escalabilidade, segurança e governança, impulsionando o crescimento e a inovação, e reforçando a resiliência dos sistemas. Além disso, fortaleci a cultura DevOps e a adoção de metodologias ágeis, melhorando a adaptabilidade e a velocidade de entrega das equipes em frente as mudanças de mercado."
  },
  {
    title: "Arquiteto de Soluções em Nuvem",
    company: "ADTsys Data Cloud",
    period: "Abr 2023 - Set 2023 (6 meses)",
    description: "Participei da equipe responsável pela transformação em nuvem de uma das maiores empresas globais de bebidas, com o desafio de melhorar a experiência dos usuários nos ambientes Azure, maximizando a eficiência operacional. Responsável Planejamento e implementação de soluções alinhadas com os objetivos de negócios, com um foco especial na otimização de custos através de FinOps e na gestão eficiente de recursos. Provisionamento de novos recursos utilizando Terraform e Terragrunt em pipelines CI/CD com Azure DevOps e desenvolvimento de automação de processos com scripts PowerShell e Python. Implementei Azure Workbooks para fornecer insights detalhados sobre FinOps e otimização de custos (recursos órfãos, tamanhos desproporciona6is de recursos), que foram importantes para a tomada de decisões pelos stakeholders sobre a gestão de recursos. As minhas iniciativas colaboraram em uma economia anual significativa de mais de 5 milhões, otimizando os investimentos em nuvem e aprimorando significativamente a gestão de recursos e a colaboração entre as equipes."
  },
  {
    title: "Consultor de Nuvem",
    company: "Telefónica Tech",
    period: "Out 2022 - Abr 2023 (7 meses)",
    description: "Integrei a equipe de operações de nuvem responsável por um ambiente Azure em escala global, atendendo mais de 100 milhões de usuários ativos. Fui encarregado de planejar soluções de alta disponibilidade e implementar as melhores práticas do setor para assegurar a resiliência, segurança e desempenho dos recursos, com foco em DevOps, incluindo serviços como Azure Kubernetes, VMs, e ferramentas como Jenkins, Nexus, e Sonarqube. Desenvolvi estratégias de segurança realizando análises de vulnerabilidades para proteger o ambiente. Participações situações de crise e elaborações de cenários de nuvem para estruturação, migração e precificação. Monitoramento e observabilidade de aplicativos, microsserviços e servidores utilizando Prometheus, Zabbix, Grafana, e analise de logs com Elasticsearch. Gerenciei Azure Kubernetes Services, VMs, Application Gateways e API Management, entre outros, promovendo práticas de DevOps. Realizei análises de vulnerabilidades, participei de troubleshootings em war rooms, elaborei cenários de nuvem e monitorei serviços usando Prometheus, Zabbix, Grafana. Também coletei e analisei logs via Elasticsearch. Minhas contribuições resultaram em melhorias na segurança, desempenho e resiliência do ambiente de nuvem Azure, promovendo práticas de DevOps eficientes e garantindo a estabilidade para uma base de grande volume de usuários ativos."
  },
  {
    title: "Engenheiro de Nuvem",
    company: "Skaylink",
    period: "Abr 2022 - Out 2022 (7 meses)",
    description: "Participei de um time internacional em uma das maiores empresas globais do setor agrícola, colaborando com profissionais de diversos países na administração, sustentação e aprimoramento da infraestrutura global On-Premise e Cloud Azure. Responsável por solucionar problemas em clusters de alta disponibilidade, envolvendo tecnologias como Windows Server (AD, File Server, DHCP, DNS), SQL Server, virtualização (VMware, Hyper-V) além do monitoramento de servidores com ferramentas avançadas e gestão de Microsoft Azure e Office 365. Executei revisões de segurança e automações de processos com scripts PowerShell e Terraform, adaptando-me a diversas culturas e metodologias de trabalho para garantir a eficiência e eficácia das soluções implementadas. A colaboração internacional enriqueceu a minha experiência no projeto, resultando em uma melhoria na infraestrutura mais resiliente, segura e eficiente, melhorando a gestão do ambiente e operação do ambiente com a interação entre equipes de diferentes culturas."
  },
  {
    title: "Analista de nuvem - Especialista Azure",
    company: "Advanced Informatica Ltda.",
    period: "Jul 2021 - Mar 2022 (9 meses)",
    description: "Fui designado para liderar projetos de migração e replicação de servidores Windows on-premises para a Microsoft Azure Cloud, enfrentando o desafio de modernizar a infraestrutura de clientes de pequeno e médio porte. Responsável por executar migrações complexas usando VPN S2S, replicação DFS entre servidores, migração para SharePoint, e provisionamento de ambientes virtuais abrangentes. Conduzi migrações do File Server para a nuvem, aproveitando o Azure File Sync para otimizar o compartilhamento e a sincronização de arquivos. Provisionamento ambientes virtuais, incluindo VMs, Azure SQL, contas de armazenamento, gateways virtuais, e cofres de backup, e realizei migrações \"Lift and Shift\" com o Azure Site Recovery. Implementação e gerenciamento do Microsoft 365 Admin Portal e o Microsoft Endpoint Manager (Microsoft Intune), reforçando a proteção e gerenciamento de dispositivos na nuvem, além de aprimorar o Azure Active Directory com políticas de acesso condicional com ou sem identidades híbridas. As minhas ações garantiram uma transição segura para a nuvem, estabelecendo uma infraestrutura Azure mais otimizada, segura e eficiente, fortalecendo a capacidade operacional da organização no ambiente cloud."
  },
  {
    title: "Analista de suporte de campo N3",
    company: "IK Solution",
    period: "Jan 2021 - Jul 2021 (7 meses)",
    description: "Atuei no suporte remoto e local de nível 3 para usuários do Sesi/Senai, lidando com incidentes e solicitações diversas. Responsável pelo diagnóstico e solução de problemas em toda a infraestrutura de rede (WAN, LAN, Wi-Fi, TCP/IP), servidores (AD, DNS, DHCP, Hyper-V), dispositidos de redes (switches, access points, roteadores, firewalls) e periféricos. Diagnostico e soluções de problemas de rede e servidores, garantindo a continuidade das operações. Instalação e configuração de sistemas operacionais Windows e Windows Servers, melhorando a infraestrutura. Consultoria para a melhorar a utilização de sistemas e equipamentos, aumentando a eficiência dos usuários. Através de um contato direto com o cliente final e aplicando as melhores práticas ITIL, resolvi tickets de forma eficiente dentro dos SLAs acordados, contribuindo para a melhoria da satisfação do usuário e a otimização dos recursos de TI."
  },
  {
    title: "Analista de Suporte N3",
    company: "Qintess",
    period: "Mai 2018 - Dez 2020 (2 anos e 8 meses)",
    description: "Atendi a incidentes e solicitações de usuários do Sesi/Senai, oferecendo suporte remoto e local de nível 3. Fui responsável por diagnosticar e solucionar problemas na infraestrutura de rede (WAN, LAN, Wi-Fi, TCP/IP), servidores (AD, DNS, DHCP, Hyper-V), dispositivos de rede (switches, access points, roteadores, firewalls) e periféricos, além da instalação e configuração de sistemas operacionais Windows. Realizei diagnósticos e soluções de problemas de rede e servidores para garantir a continuidade das operações, configurei e instalei sistemas operacionais Windows, e prestei consultoria para otimizar o uso de sistemas e equipamentos. Utilizei as melhores práticas ITIL para resolver tickets eficientemente, mantendo os SLAs acordados. Minha atuação assegurou a resolução eficaz de tickets, melhorando a satisfação do usuário e otimizando os recursos de TI, além de manter a infraestrutura de TI estável e segura."
  },
  {
    title: "Estagiário",
    company: "Finch",
    period: "Jun 2017 - Dez 2017 (7 meses)",
    description: "Responsável pelo monitoramento, manutenção e desenvolvimento de automações e seus bancos de dados (MySQL e SQL Server), utilizando Java e Python em sistemas operacionais Linux e Windows. Minha contribuição resultou na otimização dos processos internos, além de reforçar as automações de TI da empresa com soluções eficazes."
  },
  {
    title: "Analista de Sistemas Trainee",
    company: "VSM Informática",
    period: "Dez 2016 - Mar 2017 (4 meses)",
    description: "Atuei no suporte remoto para resolução de dúvidas, solução de problemas técnicos e atualizações de sistemas internos para garantir a funcionalidade e a segurança. Manutenções de bancos de dados MySQL, assegurando a integridade e a performance dos dados. Integração de PBMs e softwares de terceiros, como TEF, otimizando os processos de pedidos eletrônicos. Minhas ações contribuíram para a melhoria da experiência do cliente."
  },
  {
    title: "Assistente de Informática",
    company: "Lorac Informática",
    period: "Abr 2016 - Dez 2016 (9 meses)",
    description: "Atuei no suporte remoto para o cliente ECT/Correios, responsável por assegurar a eficácia dos sistemas operacionais Windows e a funcionalidade dos softwares dos clientes. Instalação e configuração de software e sistemas operacionais Windows, bem como a configuração de e-mail e periféricos. Instalação e configuração servidores virtuais Linux com MySQL, usando VirtualBox Hypervisor ou Putty via SSH, e monitorei os servidores com Nagios. Interações diretamente com clientes finais, aplicando as melhores práticas do ITIL para resolver chamados eficientemente dentro dos SLAs. Minha contribuição promoveu a solução eficaz de problemas, melhorando a experiência dos usuários e garantindo a estabilidade e segurança da infraestrutura."
  },
  {
    title: "Técnico de Informática",
    company: "Ausiliare Informática",
    period: "Out 2014 - Jun 2015 (9 meses)",
    description: "Suporte local aos usuários da ECT/Correios, enfrentando desafios técnicos diversos no dia a dia operacional. Efetuei instalações e configurações de sistemas operacionais Windows, assegurando a funcionalidade completa do software. Configurei e-mails e periféricos, como impressoras, para otimizar a eficiência do usuário final. Mantive contato direto com clientes, aplicando práticas do ITIL para resolver chamados dentro dos SLAs. Minha atuação resultou na melhoria da experiência do usuário, resolvendo eficientemente os problemas técnicos e garantindo a estabilidade e segurança dos sistemas operacionais e da infraestrutura."
  },
  {
    title: "Assistente Técnico",
    company: "MF Informática",
    period: "Fev 2013 - Ago 2014 (1 ano e 6 meses)",
    description: "Responsável pela manutenção completa de hardware em desktops e notebooks na empresa. Instalação e configuração de sistemas operacionais em diversas máquinas, garantindo a atualização e funcionalidade do software. Conduzi operações de backup e restauração de dados, além da instalação de programas específicos, atendendo as necessidades dos clientes. Forneci suporte técnico avançado e solucionei problemas, assegurando o desempenho de equipamentos e sistemas. Minha experiencia técnica e abordagem proativa resultaram na otimização do funcionamento dos equipamentos e elevação a satisfação dos usuários finais."
  }
];

const Experience = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Minha Jornada Profissional
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
            Nesta página quero compartilhar um pouco da minha jornada profissional e das experiências que moldaram meu caminho até aqui. 
            Desde os primeiros passos como um Assistente Técnico até a função atual de Cloud Solution Architect Senior, cada etapa desempenhou 
            um papel fundamental na minha trajetória. Espero que minha história possa inspirar e motivar outros profissionais em 
            suas próprias jornadas.
          </p>
        </div>

        <Separator className="mb-12" />

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2 flex items-start gap-2">
                      <Briefcase className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <span>{exp.title}</span>
                    </CardTitle>
                    <CardDescription className="text-lg font-medium text-foreground/80">
                      {exp.company}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">{exp.period}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Experience;
