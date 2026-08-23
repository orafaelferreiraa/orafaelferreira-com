import { Article } from '../types';

export const article: Article = {
  slug: "mvp-conf-regional-curitiba-2026",
  title: "Platform Engineering na Prática - Construindo Plataformas Serverless Self-Service",
  excerpt: "No MVP Conf Regional Curitiba 2026, mostrei como Platform Engineering resolve o anti-padrão do Shadow Ops, e como construí, com Terraform e GitHub Actions, uma plataforma serverless self-service em três pilares: Pipeline, Modules e Platform-as-a-Service.",
  content: `
# MVP Conf Regional Curitiba 2026

No dia **22 de agosto de 2026**, palestrei no [**MVP Conf Regional Curitiba 2026**](https://www.mvpconf.com.br/regional/curitiba/agosto-2026), realizado na **PUC PR**, com a sessão **"Platform Engineering na Prática - Construindo Plataformas Serverless Self-Service"**.

Uma imersão prática em Platform Engineering:qu o que é um Internal Developer Platform (IDP) de verdade, e como construí, com Terraform, GitHub Actions e uma arquitetura em três pilares, uma plataforma serverless self-service na Azure.

## O Anti-Padrão do Shadow Ops

A promessa "you build it, you run it" quebrou sob o peso da complexidade cloud-native. Exigir que desenvolvedores dominem toda a stack de infraestrutura (Kubernetes, Helm, Terraform, RBAC, CI/CD, networking) atrasa entregas e gera configurações inconsistentes, o chamado **Shadow Ops**. **44% das organizações de baixo desempenho** sofrem com desenvolvedores assumindo tarefas de infraestrutura e desviando o foco do produto.

## O Que É Platform Engineering?

Platform Engineering é construir uma plataforma interna que simplifica, padroniza e acelera o trabalho dos times de desenvolvimento. **Não é uma ferramenta. É um produto.**

- **O core da plataforma:** infraestrutura padronizada, pipelines automatizados e governança clara, processos que os devs realmente querem usar. O objetivo é tornar o caminho certo o caminho mais fácil.
- **Reduz carga cognitiva:** devs conseguem provisionar, deployar e monitorar sem precisar ser especialistas em cloud, Kubernetes ou networking. A plataforma "esconde" complexidade sem esconder poder.
- **Resultado:** velocity aumenta, erros humanos caem drasticamente e ciclos de release passam de meses para dias.

### DevOps Tradicional vs. Engenharia de Plataforma

| DevOps Tradicional | Engenharia de Plataforma |
|---|---|
| Foco em atender tickets (Ticket Ops) | Foco em criar produtos de autoatendimento |
| Engenheiros operacionais como gargalo humano | Operações automatizadas através de Golden Paths |
| Devs lidam com Shadow Ops e configs complexas | Devs focam exclusivamente em lógica de negócio |
| Relação transacional e frequentemente tóxica | Relação baseada em pesquisa de usuário e feedback contínuo |

O mercado reconhece essa mudança: Platform Engineers ganham, em média, **até 20% a mais** do que profissionais de DevOps tradicionais.

## A Anatomia de um IDP: os 5 Planos

Um Internal Developer Platform (IDP) de verdade se organiza em cinco planos:

1. **Developer Control Plane**, a interface de entrada (portais, CLI, API, workload specifications). Onde o desenvolvedor interage.
2. **Integration & Delivery Plane**, o motor lógico (CI/CD, orquestradores de plataforma). Cria configurações dinamicamente a cada \`git push\`.
3. **Resource Plane**, os recursos reais subjacentes (compute, DNS, bancos de dados, nuvem).
4. **Security Plane**, governança contínua (gerenciamento de segredos, políticas de acesso).
5. **Observability Plane**, visibilidade padronizada (logs, APM, métricas).

## O Perfil do Engenheiro de Plataforma

Um bom engenheiro de plataforma vive na intersecção de três habilidades: **habilidades técnicas profundas** (Cloud Native, Kubernetes, CI/CD, GitOps, Infraestrutura como Código), **mentalidade de produto** (visão de ciclo de vida, foco no cliente/dev, MVPs e métricas de uso) e **comunicação e empatia** (vender a solução pra liderança técnica e ouvir criticamente o desenvolvedor).

## Erros Fatais ao Adotar Platform Engineering

1. **Mudança apenas de nome**, renomear a equipe de SysAdmins para "Plataforma", mas continuar afogado em Ticket Ops.
2. **Foco em Ops, não em Devs**, construir ferramentas baseadas no que os operadores acham importante, ignorando a experiência do usuário (dev).
3. **Sem mentalidade de produto**, atender requisições ad-hoc de todos os times sem construir fluxos de trabalho escaláveis.
4. **Tecnologia pela tecnologia**, trocar ferramentas sem um motivo estratégico atrelado à produtividade.

## O Valor Real: A Experiência do Desenvolvedor (DevEx)

O objetivo final é resumir meses de configuração de infraestrutura a parâmetros essenciais. Da visão do desenvolvedor, o esforço é \`imagem = 'meu-app:v1'\`. Por trás, a engenharia oculta cuida de tudo: Container Apps Environment configurado, rede spoke \`/27\` delegada, Managed Identity vinculada nativamente, comunicação criptografada com o Azure Container Registry, e logs fluindo automaticamente pra Application Insights.

## Como Construí: Uma Arquitetura em Três Pilares

Na prática, estruturei o ecossistema em três repositórios que se conectam:

1. **Pipeline-as-a-Service**, centraliza validação e segurança, valida o código.
2. **TFse Modules-as-a-Service**, blocos de construção reutilizáveis (ex: um módulo de Azure Container Registry já com RBAC embutido). Fornece as peças.
3. **Platform-as-a-Service**, o produto final: ambientes completos via feature flags, monta a solução.

Módulos não criam apenas o recurso, eles encapsulam governança, monitoramento e acesso, escondendo a complexidade do consumidor.

### Pipeline-as-a-Service: Um Reusable Workflow

Um único **reusable workflow** de GitHub Actions elimina mais de **70 linhas de código de validação duplicadas por projeto** entre os três repositórios. Atualizações são feitas em um único lugar e se propagam pra todos os consumidores.

O fluxo sequencial de validação de infraestrutura roda em cinco etapas (com \`continue-on-error: true\`, executando todas as checagens mesmo se uma falhar):

\`terraform fmt\` (sempre ativo) → **TFLint** (boas práticas) → **Trivy** (vulnerabilidades) → **Checkov** (compliance) → **terraform-docs** (detecção de drift).

### Feature Flags e Matriz de Dependências

A plataforma final é montada por feature flags que respeitam uma matriz de dependências, por exemplo, \`enable_container_apps = true\` dispara automaticamente \`enable_observability\`, \`enable_managed_identity\` (o hub central de RBAC que conecta Storage, Service Bus, SQL e ACR) e \`enable_key_vault\`, que por sua vez depende do \`enable_sql\` pra gerenciar senhas.

A arquitetura final segue quatro camadas, com dependência obrigatória de baixo pra cima: **Base** (Resource Group, Virtual Network) → **Fundação** (Managed Identity, Key Vault) → **Serviços** (Storage, Service Bus, SQL, ACR) → **Workloads** (Azure Container Apps Environment).

## Slides da Apresentação

<i class="fa-regular fa-folder-open"></i> **Slides da Apresentação:** [Platform Engineering: Construindo uma Plataforma Serverless Self-Service](https://stoblobcertificados011.blob.core.windows.net/palestras/Platform_Engineering-MVP-CRTB.pdf)

## Repositórios da apresentação

- **Platform Stack:**
[platform-as-a-service-stack](https://github.com/orafaelferreiraa/platform-as-a-service-stack)

- **Pipeline Stack:**
[pipeline-as-a-service-stack](https://github.com/orafaelferreiraa/pipeline-as-a-service-stack)

- **TF Modules Stack:**
[tfmodules-as-a-service-stack](https://github.com/orafaelferreiraa/tfmodules-as-a-service-stack)

Obrigado ao MVP Conf Regional Curitiba pela oportunidade e a todos que estiveram na sessão!
`,
  date: "2026-08-22",
  category: "Palestras",
  readTime: "7 min de leitura",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/2026/mvp-ctba/0.png",
};
