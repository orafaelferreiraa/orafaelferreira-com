import type { Article } from '../types';

export const article: Article = {
  slug: "platform-engineering-policy-as-code",
  title: "Platform Engineering e Policy-as-Code que aceleram times",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/pac/1.png",
  excerpt: "Uma visão agnóstica de cloud sobre como Platform Engineering e Policy-as-Code reduzem carga cognitiva, aumentam segurança e aceleram entregas.",
  content: `

# Introdução

O [Platform Engineering](https://platformengineering.org/) surge como resposta à crescente complexidade das aplicações em nuvem. Criamos plataformas internas que automatizam infraestrutura e governança. A plataforma é tratada como um produto: o desenvolvedor é o cliente interno e deve encontrar o “caminho dourado” (golden path). Uma boa definição de Platform Engineering resume seu propósito: “melhorar a segurança, conformidade, custos e tempo de entrega de valor dos times de desenvolvimento por meio de experiências de desenvolvedor aprimoradas e self-service num ambiente seguro e governado”. Ao padronizar processos e oferecer automações prontas, as plataformas eliminam etapas repetitivas e reduzem drasticamente a carga cognitiva dos desenvolvedores.

![Ilustração de plataforma interna com governança integrada](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/pac/1.png)

Sem essa governança integrada, temos riscos de custos excessivos, falhas de segurança e não-conformidades. Equipes podem criar recursos em regiões caras ou não vigiadas, esquecer tags obrigatórias, expor APIs inadvertidamente etc. O Platform Engineering garante o complience disso criando guardrails automatizados: cada “guardrail” adiciona automaticamente práticas recomendadas. Isso reforça a segurança e compliance de modo invisível e natural ao desenvolvedor, acelerando entregas em vez de bloqueá-las.

## O que é Policy-as-Code (PaC)

[Policy-as-Code](https://platformengineering.org/blog/policy-as-code) é o paradigma de codificar regras de negócio, segurança e compliance em código executável, versionado e testável em pipelines. Em vez de revisar manuais, é validado automaticamente a mudança. Na prática, regras como “só usar VMs criptografadas” ou “não criar recursos fora de regiões aprovadas” viram definições de política em JSON (ou Rego, YAML etc.), armazenadas em repositório Git. Isso garante feedback rápido e contínuo: violações são detectadas tão cedo quanto possível, evitando que recursos errados cheguem à produção.

![Fluxo de Policy-as-Code validando antes do deploy](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/pac/2.png)

Quando implementamos PaC, mudamos do modelo "fazer e auditar depois" para "validar antes de implantar". Como destaca a comunidade de engenharia de plataforma, chamada "CAPOC" (Compliance At Point Of Change) – comprimir o ciclo de feedback de dias para segundos. Por exemplo, se um desenvolvedor tentar subir um container vulnerável, um engine de política ([OPA](#opa) ou [Kyverno](#kyverno)) a rejeita imediatamente, retornando erros legíveis. Assim, equipes de segurança se mantem centralizada, mas sem serem gargalo, cada time segue com autonomia porque políticas automatizadas garantem que só configurações aprovadas irão ver a luz do dia. Além disso, todo evento acaba criando trilhas de auditoria nativas que facilitam evidências de compliance.
## Ecossistema de ferramentas de políticas

O universo de PaC é amplo e, em geral, independente da nuvem. Várias ferramentas permitem implementar políticas em diferentes camadas:

### OPA (Open Policy Agent)

[Open Policy Agent](https://www.openpolicyagent.org/docs/latest/) é uma enginee de políticas open-source graduado pela CNCF. Usa a linguagem Rego para definir regras gerais e pode ser integrado em aplicações, gateways de API, pipelines CI/CD e clusters Kubernetes. É ideal para cenários multi-cloud e autorização genérica, oferecendo boa performance e trilhas de auditoria detalhadas. Com OPA, é declarada regras em Rego e avalidas as decisões no ponto de mudança (CAPOC), garantindo feedback rápido e consistente.

### Kyverno

[Kyverno](https://kyverno.io/) é uma ferramenta declarativa Kubernetes-native de PaC. Políticas em YAML validam, geram e podem até mutar recursos (por exemplo, adicionar labels faltantes automaticamente). Por ser nativo de Kubernetes, costuma ter curva de aprendizado mais suave para engenheiros de plataforma e acompanha features modernas do ecossistema.

### Conftest

[Conftest](https://www.conftest.dev/) é baseada em [OPA](#opa) e valida arquivos de infraestrutura como código antes do apply (Terraform, Kubernetes YAML, Helm, CloudFormation etc.). Escrevemos policies em Rego e executamos testes no CI/CD ou localmente (ex.: \`conftest test ./infra\`). Isso captura violações cedo (tipos de VMs não permitidos, ausência de tags obrigatórias), evitando deploys inválidos e reduzindo retrabalho.

![Conftest validando arquivos de infraestrutura como código](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/pac/3.png)

### Azure Policy

[Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview) é a solução nativa do Azure com painel de compliance, built-ins e integração com pipelines e CI. Escrevi um artigo detalhado sobre [Azure Policy na prática](https://www.orafaelferreira.com/artigos/az-policy). Em outros provedores, há equivalentes: no AWS, Service Control Policies (SCPs) e AWS Config Rules; no GCP, Organization Policies. Essas políticas nativas são ideais para aplicação universal das regras específicas de cada nuvem.

Hoje minha especialidade é cloud Azure, onde me sinto mais confortável. Recentemente criamos um projeto interno de Policy-as-Code com Terraform: colocamos as policies (arquivos .json) em uma pasta no repositório e o Terraform aplica essas definições automaticamente para toda a organização. Esse fluxo garante consistência, versionamento e a possibilidade de aplicar politicas de forma centralizada e garante governança em escala sem depender de processos manuais.

#### Um exemplo de Azure Policy

Um exemplo prático de Azure Policy que implementei em ambientes de produção foi: "Azure Backup should be enabled for Virtual Machines" (ID: 013e242c-8828-4970-87b3-ab247555486d) para auditar VMs sem item de backup associado a um Recovery Services Vault. Para passo a passo e opções de remediação (Portal, Azure Policy), veja: [Azure Backup para Máquinas Virtuais](https://www.orafaelferreira.com/artigos/azure-backup-virtual-machines).

## Fluxo DevEx com governança integrada

Para não atrapalhar a experiência do desenvolvedor (DevEx), as verificações de política devem ocorrer em todas as etapas do fluxo:

- **IDE/Local**: extensões (VSCode, IntelliJ) validam IaC e alertam sobre violações antes do commit (ex.: região proibida, tag ausente).
- **CI/CD (pré-merge)**: um job dedicado (policy-test) roda Conftest/OPA/Azure CLI Policy e barra PRs não conformes com mensagens claras.
- **Admission Controllers (Kubernetes)**: Gatekeeper ou [Kyverno](#kyverno) negam deploys inválidos (imagem não autorizada, portas indevidas) e podem mutar recursos para corrigir padrões.
- **Runtime Cloud**: [Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview), AWS Config, etc., auditam continuamente; painéis de compliance mostram o status e facilitam remediação rápida.

## Boas práticas FinOps

De acordo com a [FinOps Foundation](https://www.finops.org/), as boas práticas incluem (confira também meu artigo sobre [fundação sólida em FinOps](https://www.orafaelferreira.com/artigos/finops-foundation-cloud)):

- **Tags obrigatórias**: owner, costCenter, environment — base para alocação de custos e responsabilização.
- **Controle de SKUs/limites por ambiente**: restrinja tipos de VMs e SKUs (evita surpresas em dev/staging).
- **Desligamento automático**: pare recursos de dev/sandbox fora do horário (Azure Automation/Runbooks/Stop schedules).
- **Orçamentos e alertas**: defina budgets (ex.: 80% do previsto) e acople alertas ao pipeline; falhe deploys quando limites forem excedidos.
- **Visibilidade e análises**: exporte custos para Analytics/Power BI; use Azure Cost Management/AWS Cost Explorer para dashboards de FinOps.

Exemplo: uma [Azure Landing Zone](https://www.orafaelferreira.com/artigos/foundation-lz) já vem com tagging obrigatório e orçamentos como parte da fundação.

![Boas práticas FinOps com tagging e orçamentos na nuvem](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/pac/4.png)

## Estratégia de implantação de políticas

Ao adotar PaC e políticas de governança, faça um rollout gradual e iterativo:

**Audit → Aviso → Bloqueio → Remediação**: inicie monitorando (modo Audit) para entender impactos sem interromper processos. Depois passe a emitir warning (alertas visíveis) e só então a ações de Deny ou Modify. A comunicação ativa entre TI e times de DevOps é crucial a cada fase.

**Quick wins**: comece por políticas simples e de alto impacto, como região de implantação e tags obrigatórias. São fáceis de entender e gerarão resultados rápidos. Conforme a confiança cresce, evolua para regras mais críticas.

**Mensagens claras**: políticas devem ter descrições óbvias. Erros genéricos tipo "Policy Failed" não são úteis – prefira feedback específico ("Região inválida: use East US ou West Europe"). 

**Planos de 30/60/90 dias**: muitos times definem cronogramas de maturidade. Por exemplo, em 30 dias inventariar políticas desejadas e habilitar audit mode, em 60 dias integrar testes no CI e usar admission controllers em staging, e em 90 dias ativar bloqueios em produção para regras críticas e automatizar remediações. Assim, a governança vira um facilitador continuo, não um obstáculo emergencial.

## Conclusão

Integrar Policy-as-Code à engenharia de plataforma transforma a governança numa aliada, não num gargalo. Quando as políticas de segurança, compliance e custo são incorporadas no dia a dia de forma automatizada, elas se tornam invisíveis ao usuário – o time só vê as “regras do jogo” funcionando nos bastidores. Como resultado, equipes entregam mais rápido e com menor risco: não há mais um “time do não” bloqueando solicitações, mas sim orientações automáticas que guiam o desenvolvimento.

## Referências

- [Platform Engineering](https://platformengineering.org/)
- [Policy-as-Code](https://platformengineering.org/blog/policy-as-code)
- [Martin Fowler – Platform Engineering](https://martinfowler.com/articles/platform-teams-stuff-done.html)
- [Open Policy Agent](https://www.openpolicyagent.org/docs/latest/)
- [Kyverno](https://kyverno.io/)
- [Conftest](https://www.conftest.dev/)
- [Azure Policy Overview](https://learn.microsoft.com/en-us/azure/governance/policy/overview)
- [Azure Cloud Adoption Framework - Landing Zones](https://learn.microsoft.com/en-us/cloud-adoption-framework/landing-zones/)
- [FinOps Foundation](https://www.finops.org/)
- [Azure Policy na prática](https://www.orafaelferreira.com/artigos/az-policy)
- [Fundação sólida em FinOps](https://www.orafaelferreira.com/artigos/finops-foundation-cloud)
- [Azure Backup para Máquinas Virtuais](https://www.orafaelferreira.com/artigos/azure-backup-virtual-machines)

`,
  date: "2026-04-15",
  category: "Artigos",
  readTime: "18–22 min de leitura"
};
