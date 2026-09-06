import type { Article } from '../types';

export const article: Article = {
  slug: "microsoft-build-2026-destaques-azure",
  title: "Microsoft Build 2026: os destaques de Azure que mais me chamaram atenção",
  excerpt:
    "Os anúncios do Microsoft Build 2026 que mais importam para quem trabalha com Azure: Cobalt 200, Azure Linux 4.0, Azure Container Linux, HorizonDB e Functions.",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/Ms.Build.localhost.flp/build.png",
  content: `
O **Microsoft Build 2026** veio recheado de anúncios, e a maior parte deles gira em torno de uma palavra: **agentes**. A plataforma está sendo recortada para suportar workloads agentic AI que raciocinam, tomam decisões em sequência e rodam continuamente em escala.

![Destaques do Microsoft Build 2026 para Azure](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/Ms.Build.localhost.flp/build.png)

## Visão geral do Build 2026

O **Microsoft Build** é a conferência anual da Microsoft voltada para desenvolvedores, onde a empresa apresenta os principais lançamentos e atualizações da sua plataforma, de Azure e ferramentas de desenvolvimento a IA, dados e segurança. 
[Fonte oficial](https://news.microsoft.com/build-2026/)

## Azure Cobalt 200

O **early access preview do Azure Cobalt 200** traz a segunda geração de VMs Arm-based da Microsoft, desenhada do zero para workloads cloud-native, escaláveis e baseadas em Linux, com foco explícito em agentic AI.

- até **50% mais performance de CPU** por geração sobre o Cobalt 100
- **até 128 vCPUs por VM**, com **3 MB de cache L2 por core** e **192 MB de cache L3** no nível de sistema
- **criptografia de memória habilitada por padrão**, com impacto de performance desprezível
- ganhos reais expressivos: até 135% em banco de dados, 80% em caching e 45% em criptografia de comunicação

[Fonte oficial](https://azure.microsoft.com/en-us/blog/new-azure-cobalt-200-vms-deliver-50-performance-improvement-fully-optimized-for-modern-agentic-ai-workloads/)

## Segurança para código, agentes e modelos

Com agentes assumindo decisões antes feitas por código determinístico, a segurança muda de figura. A Microsoft trouxe anúncios focados em proteger código, agentes e modelos ao longo de todo o ciclo de desenvolvimento.

- **auditabilidade** das atividades dos agentes e **RBAC** para controlar acesso
- **circuit breakers** e guardrails independentes do próprio agente
- detecção de comportamento anômalo com possibilidade de intervenção humana a qualquer momento

[Fonte oficial](https://www.microsoft.com/en-us/security/blog/2026/06/02/microsoft-build-2026-securing-code-agents-and-models-across-the-development-lifecycle/)

## Microsoft Marketplace para apps e agentes

O Microsoft Marketplace ganhou destaque como canal para construir, escalar e monetizar aplicações e agentes.

- caminho unificado para publicar e distribuir apps e agentes
- foco em ajudar desenvolvedores e ISVs a alcançar clientes e gerar receita

[Fonte oficial](https://devblogs.microsoft.com/all-things-azure/build-scale-and-monetize-apps-and-agents-with-microsoft-marketplace/)


## Azure HorizonDB

O **Azure HorizonDB (preview)** é um serviço de banco totalmente gerenciado, cloud-native e construído sobre PostgreSQL, pensado para workloads tier-1 e aplicações de IA.

- arquitetura de **compute e storage desacoplados** com design de **database-as-a-log** para performance previsível e alta disponibilidade
- **compatibilidade total com PostgreSQL**, drivers, ORMs e SQL existentes migram com pouca ou nenhuma mudança de código
- **dois endpoints**: um de leitura/escrita (primário) e um reader que faz load-balance entre réplicas HA (hoje até 4, com plano de chegar a 8)
- **pronto para IA**: vector search, embeddings, hybrid search, reranking semântico e pipelines de IA, servindo como camada de memória e recuperação de conhecimento para agentes

[Fonte oficial](https://aka.ms/HorizonDB-Build-blog)


## Azure Linux 4.0

O **Azure Linux 4.0 (public preview)** é a distribuição Linux open-source mantida pela própria Microsoft, construída para Azure, com footprint pequeno e postura de segurança endurecida.

- base no ecossistema **Fedora**, com a familiaridade dos pacotes **RPM**
- **kernel 6.18 LTS** otimizado para Azure, com drivers Hyper-V e tuning específico
- segurança forte: kernel lockdown, **dm-verity** para boot verificado, **SELinux** e **FIPS 140-3**
- pipeline de CVE com scan **duas vezes por dia** contra a NVD; ainda **não indicado para produção**

[Fonte oficial](https://techcommunity.microsoft.com/blog/linuxandopensourceblog/announcing-azure-linux-4-0-purpose-built-for-azure-now-in-public-preview/4524267)

## Azure Container Linux (ACL)

O **Azure Container Linux (ACL)** é um sistema operacional imutável e container-optimized para node pools do AKS, derivado do projeto **Flatcar Container Linux** e já em **GA a partir do AKS 1.34**.

- diretório \`/usr\` read-only protegido por **dm-verity**, validando hash assinado em boot e runtime
- superfície de ataque mínima e **atualizações automáticas semanais** baseadas em imagem
- **SELinux em enforcing** por padrão e **Trusted Launch com Secure Boot e vTPM** obrigatórios
- criação direta com \`az aks create --os-sku AzureContainerLinux\`; atenção às limitações (sem Pod Sandboxing, Artifact Streaming e Confidential VMs)

[Fonte oficial](https://techcommunity.microsoft.com/blog/linuxandopensourceblog/introducing-azure-container-linux-acl/4523411)

## Novidades do AKS

O AKS recebeu um conjunto de anúncios no Build 2026 que ampliam o controle em toda a stack — da operação do cluster até treino e inferência de IA rodando em cima dele.

- **Managed system node pools no AKS Automatic (GA)**: o Azure passa a cuidar do ciclo de vida dos nós de sistema (capacidade, patching, escala), evitando que os componentes do cluster disputem recursos com suas cargas — importante sobretudo em nós com GPU
- **AKS on bare metal (preview)**: roda o AKS em máquinas dedicadas **sem hypervisor**, com acesso direto a NVLink, RDMA e rede de alta performance — ideal para treino grande, inferência sensível a latência e pipelines de alto throughput
- **Fleet Manager para clusters Arc-enabled (GA)**: aplica updates, políticas e posicionamento de cargas em clusters dentro e fora do Azure a partir de um único control plane, com rollout progressivo e RBAC consistente
- **Anyscale on Azure (preview)**: traz o **Ray gerenciado** ao AKS para coordenar execução distribuída (GPUs e CPUs juntas, alocação fracionada de GPU), rodando dentro da sua subscription com Entra ID
- **AI Runway + KAITO** para servir modelos de forma Kubernetes-native: você escolhe o modelo, valida o ajuste à memória de GPU disponível e faz o deploy; o KAITO provisiona nós e sobe runtimes otimizados como **vLLM**

[Fonte oficial](https://techcommunity.microsoft.com/blog/appsonazureblog/whats-new-in-azure-kubernetes-service-at-microsoft-build-2026/4524862)

## Gestão de file shares mais simples e escalável (GA)

O Azure Files ganhou um novo modelo de gerenciamento para **file shares premium SSD (NFS)**, agora em disponibilidade geral, em que cada share é criado, protegido, escalado e cobrado de forma independente, **sem ficar amarrado à storage account**.

- **Cada share é um recurso próprio**, com performance, segurança e billing isolados (modelo provisioned v2), alinhando os limites aos limites reais da aplicação ou do tenant
- **Escala maior e provisionamento mais rápido**: até **10.000 file shares por subscription por região** e **time-to-first-share 2,5x mais rápido** que os shares clássicos
- **Isolamento por share**: restrições de rede, RBAC, política, snapshots e criptografia em trânsito definidos individualmente, ideal para cenários multi-tenant de SaaS
- **Infraestrutura como código e visibilidade de custo**: define naming, capacidade, IOPS, rede e tags em Bicep/ARM, com meters de billing por share para chargeback preciso

[Fonte oficial](https://techcommunity.microsoft.com/blog/AzureStorageBlog/simpler-scalable-file-share-management-in-azure---now-generally-available/4523035)


## Outros destaques

### Project Solara

- **Plataforma chip-to-cloud** (codinome) criada do zero para experiências **agent-first** e para uma nova geração de dispositivos moldados ao redor de agentes, não de apps
- Aposta em **just-in-time UI**: a interface do agente se adapta a diferentes telas e modalidades (voz, visão, toque) sem o desenvolvedor redesenhar para cada formato
- Nasce **enterprise-ready**, com identidade (Entra ID), gestão (Intune), segurança e privacidade como fundação — além de ser **extensível** para você trazer seus próprios agentes
- Primeiros conceitos de hardware incluem um **dispositivo de crachá** (portátil) e um **dispositivo de mesa**, com silício de MediaTek e Qualcomm

[Fonte oficial](https://commandline.microsoft.com/project-solara-build-2026/)

### Microsoft Scout

- **Agente pessoal always-on**, pensado para acompanhar o usuário de forma contínua
- Conecta-se ao Microsoft 365 para agir sobre contexto real de trabalho, não só responder perguntas isoladas

[Fonte oficial](https://www.microsoft.com/en-us/microsoft-365/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/)

### Modernização agentic

- **GitHub Copilot modernization agent** chega à **disponibilidade geral**: operado pela CLI, atua como orquestrador que avalia prontidão de várias aplicações ao mesmo tempo, planeja jornadas específicas e automatiza upgrades de **Java e .NET**
- Integra-se ao fluxo nativo do GitHub criando **issues, pull requests e relatórios de avaliação** por aplicação, com coordenação assíncrona via coding agent e trilha de auditoria no **Agent HQ**
- Faz par com o **Azure Copilot migration agent (preview)**, que cobre o planejamento em escala de estate — descoberta, mapeamento de dependências, análise de ROI e wave planning — reduzindo meses de análise a minutos
- **Custom skills (GA)**: o time codifica padrões, bibliotecas e boas práticas em arquivos \`skill.md\` (formato aberto) e reaproveita em todo o portfólio
- Resultado relatado pela Microsoft: modernização até **4x mais rápida** em centenas de milhares de apps legados .NET e Java

[Fonte oficial](https://techcommunity.microsoft.com/blog/AppsonAzureBlog/closing-the-ai-readiness-gap-with-agentic-modernization/4524011)

### Microsoft Web IQ

- **Inteligência de busca para a web**, trazendo dados e contexto atualizados para aplicações e agentes
- Pensado para alimentar experiências de IA com informação fresca da web em vez de conhecimento estático

[Fonte oficial](https://blogs.bing.com/search/June-2026/Announcing-Microsoft-Web-IQ)

## Azure Functions no Build 2026

No serverless, a mensagem reforça uma direção clara: o **Flex Consumption é onde as novidades chegam primeiro**.

- **cold starts menores** com instâncias always-ready e **integração com rede virtual**
- **per-function scaling** e **scale-out de até 1.000 instâncias** (contra 200 do Consumption)
- **mounts de Azure Files** para binários grandes e modelos de ML sem empacotar no deploy
[Fonte oficial](https://techcommunity.microsoft.com/blog/appsonazureblog/azure-functions-at-build-2026-update/4524075)

## Demos do Build 2026

Para ver na prática, seguem demos selecionadas do canal **Microsoft Developer**, todas gravadas no Build 2026. Cada uma é curta e vai direto ao ponto:

### OpenClaw + Windows

- Mostra o **OpenClaw rodando em conjunto com o Windows**, no contexto da plataforma de desenvolvimento
- Boa amostra de como ferramentas de agente se integram ao ambiente nativo do sistema
- Teve a **participação especial do fundador da Open Cloud**, comentando um pouco de como ele está animado com o que está por vir

[![OpenClaw + Windows no Build 2026](https://img.youtube.com/vi/J7ol1VDkg7w/hqdefault.jpg)](https://www.youtube.com/watch?v=J7ol1VDkg7w)

[Assistir no YouTube](https://www.youtube.com/watch?v=J7ol1VDkg7w)

### Developer Experience on Windows

- Um tour pela **experiência de desenvolvimento no Windows**, alinhada aos anúncios de ferramentas para devs (Coreutils, WSL, configurações otimizadas)
- Útil para quem quer entender o caminho que a Microsoft está traçando para o fluxo de trabalho no Windows

[![Developer Experience on Windows no Build 2026](https://img.youtube.com/vi/xVWHZkuhgys/hqdefault.jpg)](https://www.youtube.com/watch?v=xVWHZkuhgys)

[Assistir no YouTube](https://www.youtube.com/watch?v=xVWHZkuhgys)

### GitHub App + Rayfin

- Integração de um **GitHub App com o Rayfin**, ilustrando fluxos de automação e produtividade
- Mostra na prática como conectar repositórios a automações de ponta a ponta

[![GitHub App + Rayfin no Build 2026](https://img.youtube.com/vi/gJX6MOyef8Q/hqdefault.jpg)](https://www.youtube.com/watch?v=gJX6MOyef8Q)

[Assistir no YouTube](https://www.youtube.com/watch?v=gJX6MOyef8Q)

### Microsoft Discovery

- Demonstração do **Microsoft Discovery** aplicado a cenários de pesquisa e descoberta acelerada por IA
- Dá uma ideia de como a IA encurta o tempo entre uma pergunta e uma resposta acionável

[![Microsoft Discovery no Build 2026](https://img.youtube.com/vi/uHtva5r9itY/hqdefault.jpg)](https://www.youtube.com/watch?v=uHtva5r9itY)

[Assistir no YouTube](https://www.youtube.com/watch?v=uHtva5r9itY)

### MDASH

- **MDASH** é o codinome do **sistema de varredura de segurança agêntica multimodelo** da Microsoft Security, criado pela equipe de Segurança de Código Autônomo
- Diferente de abordagens de modelo único, **orquestra mais de 100 agentes de IA especializados** (modelos de fronteira e destilados) para descobrir, debater e comprovar bugs exploráveis de ponta a ponta
- Na prática, ajudou a encontrar **16 novas vulnerabilidades** na pilha de redes e autenticação do Windows, incluindo 4 falhas críticas de execução remota de código

[![MDASH no Build 2026](https://img.youtube.com/vi/8QBDaRbur70/hqdefault.jpg)](https://www.youtube.com/watch?v=8QBDaRbur70)

[Assistir no YouTube](https://www.youtube.com/watch?v=8QBDaRbur70)

## Resumo brabo do que vem por ai: tudo aponta para agentes

`,
  date: "2026-06-07",
  category: "Artigos",
  readTime: "9 min de leitura",
  tags: ["IA"],
  excludeTags: ["Docker"]
};

