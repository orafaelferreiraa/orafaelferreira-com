// ...existing code...
import { Article } from './types';

export const article: Article = {
  slug: "artigo-terraform-infra-cicd",
  title: "A Stack por trás do meu Blog: IaC com Terraform, Static Web Apps e Github Actions",
  excerpt: "Como migrei meu blog para uma arquitetura moderna com Terraform e GitHub Actions: state remoto em Azure Storage, Static Web Apps, domínio customizado e um pipeline confiável que leva cada mudança para produção.",
  content: `# Visão Geral

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/2025-12-13-terraform-site.ts.png)


Algumas semanas atrás eu decidi migrar meu blog para uma versão mais moderna, simples de operar e fácil de evoluir. O plano: 
Terraform para declarar infraestrutura, GitHub Actions para orquestrar e Azure Static Web Apps para hospedar. Neste artigo, irei contar um pouco dessa jornada:


Vamos passar por tudo o que sustenta o blog hoje:

- Organização dos arquivos Terraform (providers, backend, variáveis e recursos)
- Estratégia de state remoto em Azure Storage
- Provisionamento do SWA e domínio customizado
- Padrões de execução local com Service Principal
- Pipelines CI/CD no GitHub Actions para "plan" (PRs) e "apply" (push em main)
- Segurança, lint e scans: TFLint, tfsec, Checkov (era preciso tudo isso? claro que não! meu site se tornou meu projeto pessoal de estudos)
- Automatização de documentação com terraform-docs
- Integração com o deploy do app (build + upload da pasta \"dist\")

Ao final, você terá uma visão ponta a ponta do que acontece desde um "git push" até o site atualizado em produção.


## Estrutura Terraform

Dentro da pasta \`infra/\` temos os principais arquivos que definem a infraestrutura:

- \`providers.tf\`: versão do Terraform, provider \`azurerm\` e suas capabilities.
- \`backend.tf\`: configuração do backend remoto do state no Azure Storage.
- \`variables.tf\`: variáveis para vincular o repositório ao SWA (URL, branch e token).
- \`main.tf\`: recursos da solução (Static Web App + domínio customizado) e o resource group consumido como data source.

### providers.tf

O arquivo fixa as versões para garantir reprodutibilidade e compatibilidade:

\`\`\`terraform
terraform {
  required_version = "1.13.4"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.50.0"
    }
  }
}

provider "azurerm" {
  features {}
}
\`\`\`

- **Terraform**: versão 1.13.4, versão mais atual de quando fiz o projeto
- **Provider azurerm**: versão 4.50.0, versão mais atual de quando fiz o projeto

### backend.tf

Quando migrei, uma das primeiras decisões foi nunca manter state local.

\`\`\`terraform
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-site"
    storage_account_name = "stostateorafael"
    container_name       = "statetf"
    key                  = "infra.terraform.tfstate"
    use_azuread_auth     = true
  }
}
\`\`\`

- **RG/Storage/Container**: isolam o state em um bucket dedicado.

### variables.tf

Variáveis me ajudaram a controlar comportamentos por ambiente: no apply em main, os valores reais chegam via secrets. Isso mantém o fluxo seguro com segurança.

\`\`\`terraform
variable "repository_url" {
  description = "GitHub repository URL para SWA (vazio em PR)"
  type        = string
  default     = ""
}

variable "repository_branch" {
  description = "Branch do repositório para SWA (vazio em PR)"
  type        = string
  default     = ""
}

variable "repository_token" {
  description = "GitHub PAT para linkage CI (omitido em PR)"
  type        = string
  sensitive   = true
  default     = ""
}
\`\`\`

- Em apply, os valores reais chegam via secrets do GitHub Actions.

### main.tf

Aqui fica a cereja do bolo: o Azure Static Web Apps na camada gratuita com domínio customizado. Eu queria um hosting estável, com HTTPS automático e integração perfeita com GitHub. O SWA entrega isso sem dor de cabeça.

\`\`\`terraform
# Recurso de RG existente (fora do TF)
data "azurerm_resource_group" "rg" {
  name = "rg-site"
}

# Static Web Apps (SWA)
resource "azurerm_static_web_app" "this" {
  name                = "swa-site-orafael"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = "eastus2"
  sku_tier = "Free"
  sku_size = "Free"
  repository_url    = var.repository_url
  repository_branch = var.repository_branch
  repository_token  = var.repository_token
}

# Domínio customizado (validação DNS via TXT)
resource "azurerm_static_web_app_custom_domain" "txt-value" {
  static_web_app_id = azurerm_static_web_app.this.id
  domain_name       = "www.orafaelferreira.com"
  validation_type   = "dns-txt-token"
}
\`\`\`

- O RG é um **data source** (mantido fora do Terraform), já que é onde fica o storage account para manter o state remoto.
- O SWA tem linkage com este repositório, então o deploy do blog é natural ao meu fluxo de commits.
- O domínio **www.orafaelferreira.com** usa validação por DNS TXT; depois da propagação, o Azure cuida dos certificados.

## Service Principal

Para validação das pipelines podem fazer o deploy na cloud, estou utilizando Service Principal (SP).
Exemplo de export das credenciais (Linux) e execução:

\`\`\`bash
export ARM_CLIENT_ID=<appId-do-SP>
export ARM_CLIENT_SECRET=<clientSecret-do-SP>
export ARM_TENANT_ID=<tenantId>
export ARM_SUBSCRIPTION_ID=<subscriptionId>
export SWA_REPOSITORY_TOKEN=<github-PAT>

cd infra
terraform init
terraform plan
terraform apply -auto-approve \
  -var "repository_url=https://github.com/<owner>/<repo>" \
  -var "repository_branch=main" \
  -var "repository_token=\${SWA_REPOSITORY_TOKEN}"
cd -
\`\`\`

> Em ambientes Windows PowerShell, adapte com \`$Env:VAR=valor\`.

## Pipelines CI/CD no GitHub Actions
Se a infraestrutura é o esqueleto, os pipelines que bota pra rodar. Cada commit tem revisão, aplicação e publicação.

A automação está dividida em três workflows principais.

### 1) \`infra-plan.yml\` (PRs)

Dispara em pull requests que alteram \`infra/**\` ou o próprio workflow. Objetivo: validações e geração do **plan**.

Passos:
- \`actions/checkout@v4\`
- \`hashicorp/setup-terraform@v3\` (Terraform 1.13.4)
- Cache dos providers Terraform e plugins do TFLint
- \`terraform init\`
- \`terraform fmt -check -recursive\` (não quebra o build em PR)
- \`terraform validate\`
- \`tflint --init && tflint -f compact\`
- \`tfsec\` e \`Checkov\` com \`soft_fail: false\` (quebram em achados críticos)
- \`terraform plan -out=tfplan\` com variáveis placeholder
- Upload do artifact \`tfplan\`
- Comentário no PR com o **plan** já expandido (sem tabela de status). Eu quis reduzir cliques e atrito: abrir o PR e já ver o que muda.

### 2) \`infra-apply.yml\` (push em main)

Dispara em push que altera \`infra/**\` ou o próprio workflow, e também pode ser manual via \`workflow_dispatch\`.

Passos de segurança e qualidade:
- \`terraform init\`, \`fmt\`, \`validate\`, \`tflint\`, \`tfsec\`, \`Checkov\` (mesma base do plan)
- \`terraform apply -auto-approve\` com \`repository_url\`, \`repository_branch\`, \`repository_token\` vindos de secrets
- **terraform-docs**: injeta documentação do módulo no \`README.md\` e commita automaticamente (quando houver alteração)
- **Job Summary**: resumo simples (branch/actor/backend/status), sem seção de outputs para evitar ruído quando não definidos. Na migração eu removi a seção de outputs do summary para evitar alertas desnecessários.

### 3) \`deploy-app.yml\` (build + upload da SPA)

Dispara em push de arquivos do app, manual (\`workflow_dispatch\`) e após conclusão bem-sucedida do \`infra-apply\` via \`workflow_run\`.

Pipeline do app:
- Node 20 + cache npm
- \`npm install\`
- Testes: unitário (Vitest), componentes (RTL) e E2E smoke (Playwright)
- \`npm run typecheck\` e \`npm run build\`
- Cache de browsers do Playwright (otimiza tempo e custo)
- Deploy com \`Azure/static-web-apps-deploy@v1\` usando \`action: upload\` e \`skip_app_build: true\` (fazemos o build antes). Essa foi uma escolha de performance e previsibilidade no build.

Proteção contra loops:
- Condição no job: \`(github.event_name == 'push' && github.actor != 'github-actions[bot]')\`…
- Isso evita que commits automatizados (ex.: terraform-docs) disparem deploys do app desnecessariamente — um ajuste que nasceu de um incidente: o bot fazia commit e o app queria redeploy sem mudanças reais.

## Segurança e Qualidade

- **TFLint**: enforce de boas práticas e estilo nos \`.tf\`.
- **tfsec**: análise de segurança estática específica para Terraform (Azure incluído).
- **Checkov**: políticas de segurança e conformidade (CSPM) adicionais.
- **actions/cache@v4**: acelera builds mantendo providers e plugins.
- **Sem outputs no summary**: evita confusão quando não há \`output\` definido no módulo.

> Observação: caso sejam necessários outputs (ex.: hostname, IDs), basta adicionar blocos \`output\` em \`infra/\` e consumir no resumo/pipelines. Por ora, optei por manter o módulo minimalista.


## Documentação Automatizada

Durante a migração, quis que a documentação acompanhasse o código sem esforço humano. O \`infra-apply.yml\` roda **terraform-docs** e injeta a referência do módulo no \`README.md\`. Se não houver mudanças, nenhum commit é feito — é documentação viva, sem burocracia.


## Fluxo de Trabalho: do PR ao Deploy

1. **PR em \`infra/**\`** → roda \`infra-plan.yml\`: valida, escaneia segurança e gera o \`plan\`.
2. **Merge em \`main\`** → roda \`infra-apply.yml\`: aplica mudanças, atualiza docs.
3. **Push do app** (ou workflow_run de infra) → roda \`deploy-app.yml\`: builda e publica a pasta \`dist/\` no SWA. Esse foi o momento mais satisfatório da migração: ver o blog ir ao ar segundos depois do merge.

Tudo isso com proteção contra loops de commits do bot e com caches para acelerar o ciclo.

Caso queira dar uma olhada em detalhes: [Workflows](https://github.com/orafaelferreiraa/orafaelferreira-com/tree/main/.github/workflows)

## Conclusão

A combinação de Terraform + GitHub Actions entrega uma infraestrutura escalável, auditável e automatizada. 
Com state remoto seguro, validações de segurança e documentação contínua, o resultado é um pipeline confiável que leva alterações de infraestrutura e aplicação ao Azure de forma robusta.

![](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/posts/Logo2.png)`,
  date: "2025-12-13",
  category: "Artigos",
  readTime: "13 min de leitura"
};