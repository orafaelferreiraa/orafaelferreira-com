# orafaelferreira-com (SPA)

Site pessoal/Blog em Vite + React + TypeScript, hospedado na Azure Static Web Apps (SWA) com CI/CD via GitHub Actions e infraestrutura em Terraform.

## stack

- Vite, React, TypeScript, TailwindCSS, shadcn/ui
- Azure Static Web Apps (SWA) para hosting
- Terraform (infra/) com state remoto em Azure Storage
- GitHub Actions: deploy do app e provisionamento da infra

## desenvolvimento local

Requisitos: Node.js 20+

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## deploy do app (SWA)

O deploy é automático no push para `main` quando arquivos do app mudam (`src/`, `public/`, `index.html`, configs) e também após a conclusão bem-sucedida do workflow `infra-apply` (via `workflow_run`). Workflow: `.github/workflows/deploy-app.yml`.

**Pipeline de deploy:**
- Build: `npm install` + `npm run test:ci` + `npm run test:components:ci` + `npm run typecheck` + `npm run build`
- Deploy: usa `Azure/static-web-apps-deploy@v1` com `action: upload`, `skip_app_build: true` e `app_location: dist`
- Não roda em PRs (somente em push e após infra-apply)

**Secrets necessários:**
- `AZURE_STATIC_WEB_APPS_API_TOKEN` (deployment token do SWA)

## infraestrutura (Terraform)

Código em `infra/` provisiona:
- Resource Group
- Static Web App (SWA)

State remoto em Azure Storage (backend `azurerm`). Configure no `terraform init` com:

```bash
terraform init \
	-backend-config="resource_group_name=<rg-do-state>" \
	-backend-config="storage_account_name=<statename>" \
	-backend-config="container_name=tfstate" \
	-backend-config="key=infra.terraform.tfstate"
```

Execução local (Service Principal):

```bash
export ARM_CLIENT_ID=<appId-do-SP>
export ARM_CLIENT_SECRET=<clientSecret-do-SP>
export ARM_TENANT_ID=<tenantId>
export ARM_SUBSCRIPTION_ID=<subscriptionId>
export SWA_REPOSITORY_TOKEN=<github-PAT>
cd infra
terraform plan
terraform apply -auto-approve \
  -var "repository_url=https://github.com/<owner>/<repo>" \
  -var "repository_branch=main" \
  -var "repository_token=${SWA_REPOSITORY_TOKEN}"
cd -
```

### Pipelines de infraestrutura

**PR workflow** (`.github/workflows/infra-plan.yml`):
**PR workflow** (`.github/workflows/infra-plan.yml`):
- Disparo: PRs que alteram `infra/**` ou o próprio workflow
- Passos: `init` → `fmt` → `validate` → `tflint` → `tfsec` → `checkov` → `plan`
- Plan usa valores placeholder para `repository_*` (não requer secrets de GitHub)
- Artifact do plan é salvo e comentário detalhado é postado no PR
- Validações de segurança: tfsec e Checkov (soft_fail: false)

**Push workflow** (`.github/workflows/infra.yml` - nome: `infra-apply`):
- Disparo: push em `main` que altera `infra/**` ou o próprio workflow
- Passos: `init` → `fmt` → `validate` → `tflint` → `tfsec` → `checkov` → `apply`
- Apply usa valores reais via secrets (repository linkage)
- Documentação com `terraform-docs` é injetada no README e commitada automaticamente
- Resumo do job com outputs do Terraform

**Secrets necessários:**
- `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_CLIENT_SECRET` (Service Principal)
- `GH_PAT_SWA` (GitHub PAT para linkage do SWA com o repositório)

### Referência do módulo (auto)

O bloco abaixo é gerado automaticamente pelo `terraform-docs` a partir do conteúdo de `infra/`. Ele é atualizado em pushes para `main`.

<!-- BEGIN_TF_DOCS -->
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) | 1.13.4 |
| <a name="requirement_azurerm"></a> [azurerm](#requirement\_azurerm) | 4.50.0 |

## Providers

| Name | Version |
|------|---------|
| <a name="provider_azurerm"></a> [azurerm](#provider\_azurerm) | 4.50.0 |

## Modules

No modules.

## Resources

| Name | Type |
|------|------|
| [azurerm_static_web_app.this](https://registry.terraform.io/providers/hashicorp/azurerm/4.50.0/docs/resources/static_web_app) | resource |
| [azurerm_static_web_app_custom_domain.txt-value](https://registry.terraform.io/providers/hashicorp/azurerm/4.50.0/docs/resources/static_web_app_custom_domain) | resource |
| [azurerm_resource_group.rg](https://registry.terraform.io/providers/hashicorp/azurerm/4.50.0/docs/data-sources/resource_group) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_repository_branch"></a> [repository\_branch](#input\_repository\_branch) | Branch do repositório para SWA (vazio em PR) | `string` | `""` | no |
| <a name="input_repository_token"></a> [repository\_token](#input\_repository\_token) | GitHub PAT para linkage CI (omitido em PR) | `string` | `""` | no |
| <a name="input_repository_url"></a> [repository\_url](#input\_repository\_url) | GitHub repository URL para SWA (vazio em PR) | `string` | `""` | no |

## Outputs

No outputs.
<!-- END_TF_DOCS -->

## domínios e HTTPS

O domínio customizado `www.orafaelferreira.com` são configurados via Terraform no SWA.

**Setup**: Consulte o guia completo em [`infra/CUSTOM_DOMAIN.md`](./infra/CUSTOM_DOMAIN.md) para:
- Obter tokens de validação DNS
- Configurar registros DNS (CNAME/TXT) no seu registrador
- Validar e provisionar certificado SSL/TLS automático (Let's Encrypt)

**TLS**: Certificados são provisionados e renovados automaticamente pelo Azure após validação DNS.

## notas

- Testes: CI roda unit tests (`vitest`) e component tests (React Testing Library). E2E com Playwright está configurado mas comentado.
- Lint no CI foi desabilitado para evitar ruído causado por conteúdo em markdown inline nos arquivos de artigos. O typecheck (TS) permanece ativo.
- A pasta `infra/` possui `.gitignore` próprio para evitar que `.terraform/`, `*.tfstate` e `*.tfplan` entrem em commits. O lockfile `.terraform.lock.hcl` é versionado.
- A pipeline de deploy usa `npm install` ao invés de `npm ci` para maior flexibilidade quando há atualizações de dependências.
- Workflows de infra e deploy são independentes mas coordenados: mudanças de infra triggam apply → deploy do app via `workflow_run`.
