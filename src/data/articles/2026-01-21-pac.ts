import { Article } from './types';

export const article: Article = {
  slug: "platform-engineering-policy-as-code-governanca-invisivel",
  title: "Governança Invisível: Platform Engineering e Policy-as-Code que aceleram times",
  image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/gov-pac/cover.png",
  excerpt: "Uma visão agnóstica de cloud sobre como Platform Engineering e Policy-as-Code reduzem carga cognitiva, aumentam segurança e aceleram entregas.",
  content: `

# Introdução

![Imagem de capa](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/gov-pac/cover.png)

O [Platform Engineering](https://platformengineering.org/) surge como resposta à crescente complexidade das aplicações em nuvem. Criamos plataformas internas que automatizam infraestrutura e governança. Nesse modelo, a plataforma é tratada como um produto: o desenvolvedor é o cliente interno e deve encontrar o “caminho dourado” (golden path). Uma boa definição de Platform Engineering resume seu propósito: “melhorar a segurança, conformidade, custos e tempo de entrega de valor dos times de desenvolvimento por meio de experiências de desenvolvedor aprimoradas e self-service num ambiente seguro e governado”. Ao padronizar processos e oferecer automações prontas, as plataformas eliminam etapas repetitivas e reduzem drasticamente a carga cognitiva dos desenvolvedores.

Sem essa governança integrada, ficam evidentes riscos de custos excessivos, falhas de segurança e não-conformidades. Equipes podem criar recursos em regiões caras ou não vigiadas, esquecer tags obrigatórias, expor APIs inadvertidamente etc. O Platform Engineering combate isso criando guardrails automatizados: cada “guardrail” adiciona automaticamente práticas recomendadas, de modo que seguir o caminho certo seja natural e fácil. Isso reforça a segurança e compliance de modo invisível e natural ao desenvolvedor, acelerando entregas em vez de bloqueá-las.

## O que é Policy-as-Code (PaC)

[Policy-as-Code](https://platformengineering.org/blog/policy-as-code) é o paradigma de codificar regras de negócio, segurança e compliance em código executável, versionado e testável em pipelines. Em vez de revisar manuais, é validado automaticamente a mudança. Na prática, regras como “só usar VMs criptografadas” ou “não criar recursos fora de regiões aprovadas” viram definições de política em JSON (ou Rego, YAML etc.), armazenadas em repositório Git. Isso garante feedback rápido e contínuo: violações são detectadas tão cedo quanto possível, evitando que recursos errados cheguem à produção.

Quando implementamos PaC, mudamos do modelo "fazer e auditar depois" para "validar antes de implantar". Como destaca a comunidade de engenharia de plataforma, chamada "CAPOC" (Compliance At Point Of Change) – comprime o ciclo de feedback de dias para segundos. Por exemplo, se um desenvolvedor tentar subir um container vulnerável, um engine de política ([OPA](#opa) ou [Kyverno](#kyverno)) a rejeita imediatamente, retornando erros legíveis. Assim, equipes de segurança mantêm autoridade central, mas sem serem gargalo, cada time segue com autonomia porque políticas automatizadas garantem que só configurações aprovadas irão ver a luz do dia. Além disso, todo evento acaba criando trilhas de auditoria nativas que facilitam evidências de compliance.

## Azure Backup should be enabled for Virtual Machines

Para um guia completo sobre backup de VMs no Azure, confira meu artigo sobre [Azure Backup para Máquinas Virtuais](https://www.orafaelferreira.com/artigos/azure-backup-virtual-machines).

### Visão geral

A policy \`"Azure Backup should be enabled for Virtual Machines"\` (ID: \`013e242c-8828-4970-87b3-ab247555486d\`) é essencial em ambientes corporativos. Ela garante que VMs críticas não fiquem sem proteção, reduzindo riscos de perda de dados, downtime e exposição a ataques como ransomware. A policy atua em modo \`AuditIfNotExists\`: não impede a criação da VM, mas marca como non-compliant VMs sem um item de backup associado em um Recovery Services Vault.

### Como funciona (resumo técnico)

A definição verifica, para cada \`Microsoft.Compute/virtualMachines\`, a existência de \`Microsoft.RecoveryServices/vaults/backupProtectedItems\`. Se inexistente, gera não conformidade. Aplicada ao nível de Subscription ou Resource Group, dá visibilidade contínua e escalável das VMs sem backup.

### Aplicação prática e remediação (habilitando backups)

1. **Via Portal**: atribuir a definição ao escopo desejado (Subscription/RG) e, quando necessário, habilitar backup manualmente na VM apontando para um Recovery Services Vault.
2. **Via [Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview) automatizada**: usar \`DeployIfNotExists\` para criar ou associar Recovery Services Vaults e configurar backup automaticamente para VMs não protegidas.
3. **Via IaC (exemplo prático com Terraform)**:

\`\`\`hcl
resource "azurerm_recovery_services_vault" "vault" {
  name                = "vault-backups-exemplo"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku                 = "Standard"
}

resource "azurerm_backup_policy_vm" "policy" {
  name                = "policy-diaria"
  resource_group_name = azurerm_resource_group.rg.name
  recovery_vault_name = azurerm_recovery_services_vault.vault.name
  backup {
    frequency = "Daily"
    time      = "23:00"
  }
  retention_daily {
    count = 7
  }
}

resource "azurerm_backup_protected_vm" "backup_associacao" {
  resource_group_name = azurerm_resource_group.rg.name
  recovery_vault_name = azurerm_recovery_services_vault.vault.name
  source_vm_id        = azurerm_linux_virtual_machine.vm.id
  backup_policy_id    = azurerm_backup_policy_vm.policy.id
}
\`\`\`

Depois de aplicado, execute:

\`\`\`bash
az policy state trigger-scan --subscription <subscription-id>
\`\`\`

### Por que incluir esse case no artigo

É um exemplo prático de como uma [Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview) se integra ao lifecycle da infraestrutura (IaC → CI/CD → avaliação contínua) e como PaC pode remediar automaticamente lacunas críticas de resiliência em larga escala.

## Ecossistema de ferramentas de políticas

O universo de PaC é amplo e, em geral, independente da nuvem. Várias ferramentas permitem implementar políticas em diferentes camadas:

### OPA (Open Policy Agent) {#opa}

[Open Policy Agent](https://www.openpolicyagent.org/docs/latest/) é um motor de políticas open-source graduado pela CNCF. Usa a linguagem Rego para definir regras gerais e pode ser integrado em aplicações, gateways de API, pipelines CI/CD e clusters Kubernetes.

### Kyverno {#kyverno}

[Kyverno](https://kyverno.io/) é uma ferramenta declarativa Kubernetes-native de PaC, com YAML e suporte a mutações, validações e geração de recursos.

### Conftest

[Conftest](https://www.conftest.dev/) é baseada em [OPA](#opa) e valida arquivos de infraestrutura como código antes do apply.

### Azure Policy

[Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview) é a solução nativa do Azure com painel de compliance, built-ins e integração com pipelines e CI. Escrevi um artigo detalhado sobre [Azure Policy na prática](https://www.orafaelferreira.com/artigos/az-policy).

Hoje minha especialidade é cloud Azure, onde me sinto mais confortável. Recentemente criamos um projeto interno de Policy-as-Code com Terraform: colocamos as policies (arquivos .json) em uma pasta no repositório e o Terraform aplica essas definições automaticamente para toda a organização. Esse fluxo garantiu consistência, versionamento e a possibilidade de aplicar quick-wins de governança em escala sem depender de processos manuais.

## Implementação prática

Todo esse conceito ganha força quando integrado às práticas de desenvolvimento contínuo. A seção abaixo detalha como essas verificações devem estar presentes em todas as etapas.

## Fluxo DevEx com governança integrada

Para não atrapalhar a experiência do desenvolvedor (DevEx), as verificações de política devem ocorrer em todas as etapas do fluxo:

- **IDE/Local**: extensões de editor (VSCode, IntelliJ) alertam sobre violações antes mesmo do commit.
- **CI/CD (pré-merge)**: job policy-test que executa validadores e barra PRs fora do padrão.
- **Admission Controllers (Kubernetes)**: Gatekeeper ou [Kyverno](#kyverno) impedem deploys inválidos e aplicam mutações automáticas.
- **Runtime Cloud**: [Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview), AWS Config, entre outros, auditam continuamente recursos provisionados.

## Boas práticas FinOps

De acordo com a [FinOps Foundation](https://www.finops.org/), as boas práticas incluem (confira também meu artigo sobre [fundação sólida em FinOps](https://www.orafaelferreira.com/artigos/finops-foundation-cloud)):

- **Tags obrigatórias**: owner, costCenter, environment.
- **Controle de SKUs por ambiente**.
- **Desligamento automático** de ambientes não produtivos.
- **Orçamentos e alertas** integrados ao ciclo de deploy.

Exemplo: uma [Azure Landing Zone](https://learn.microsoft.com/en-us/cloud-adoption-framework/landing-zones/) já vem com tagging obrigatório e orçamentos como parte da fundação.

## Estratégia de implantação de políticas

A implementação de políticas deve seguir uma progressão cuidadosa:

**Audit → Warn → Deny → Remediate**

- Comece com políticas fáceis de explicar (tags, região).
- Use mensagens claras no erro.
- Roadmap 30/60/90 dias para endurecer aos poucos.

## Conclusão

Integrar [Policy-as-Code](https://platformengineering.org/blog/policy-as-code) à [engenharia de plataforma](https://platformengineering.org/) transforma a governança numa aliada, não num gargalo. Quando as políticas são automatizadas e embutidas na plataforma, elas liberam os devs para inovar com segurança.

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
  date: "2026-01-21",
  category: "Artigos",
  readTime: "18–22 min de leitura",
  mediumUrl: ""
};
