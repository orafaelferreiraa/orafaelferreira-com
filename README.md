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

O deploy é automático no push para `main` quando arquivos do app mudam (`src/`, `public/`, `index.html`, configs) e também ao concluir o workflow de infra. Workflow: `.github/workflows/deploy-app.yml`.

Build no CI: `npm ci` + `npm run typecheck` + `npm run build`.

Upload para o SWA: o workflow usa `Azure/static-web-apps-deploy@v1` com `action: upload`, `skip_app_build: true` e `app_location: dist` (somente a pasta `dist` é enviada).

Pré-requisito: criar o recurso SWA (via Terraform) e adicionar o secret no repositório:
- `AZURE_STATIC_WEB_APPS_API_TOKEN` (token de deployment do SWA)

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
cd infra
terraform plan -var "resource_group_name=<rg>" -var "static_site_name=<nome-único>"
terraform apply -auto-approve -var "resource_group_name=<rg>" -var "static_site_name=<nome-único>"
cd -
```

Pipeline de infra: `.github/workflows/infra.yml`
- Disparo em `infra/**` (push/PR) e permite conciliação com a pipeline do app.
- Autenticação Azure por Service Principal. Adicione os secrets:
	- `AZURE_CLIENT_ID`
	- `AZURE_TENANT_ID`
	- `AZURE_SUBSCRIPTION_ID`
	- `AZURE_CLIENT_SECRET`
- Passos: `init` → `fmt` (PR em modo `-check`) → `validate` → `plan` (PR com upload de artifact) → `apply` (push em `main`).
- Documentação com `terraform-docs` é gerada antes do `init` e, em `push` para `main`, o README é atualizado com commit automático.
- Resumo do job: a pipeline escreve um resumo no GitHub Summary com informações de evento, branch, outputs (em push) e status da doc.

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
| <a name="input_repository_branch"></a> [repository\_branch](#input\_repository\_branch) | GitHub repository branch to link SWA (optional for PRs; provided on push) | `string` | n/a | yes |
| <a name="input_repository_token"></a> [repository\_token](#input\_repository\_token) | GitHub PAT used by Azure to configure CI linkage (provided on push) | `string` | n/a | yes |
| <a name="input_repository_url"></a> [repository\_url](#input\_repository\_url) | GitHub repository URL to link SWA (optional for PRs; provided on push) | `string` | n/a | yes |

## Outputs

No outputs.
<!-- END_TF_DOCS -->

## domínios e HTTPS

O domínio customizado `orafaelferreira.com` e `www.orafaelferreira.com` são configurados via Terraform no SWA.

**Setup**: Consulte o guia completo em [`infra/CUSTOM_DOMAIN.md`](./infra/CUSTOM_DOMAIN.md) para:
- Obter tokens de validação DNS
- Configurar registros DNS (CNAME/TXT) no seu registrador
- Validar e provisionar certificado SSL/TLS automático (Let's Encrypt)

**TLS**: Certificados são provisionados e renovados automaticamente pelo Azure após validação DNS.

## notas

- Lint no CI foi desabilitado para evitar ruído causado por conteúdo em markdown inline nos arquivos de artigos. O typecheck (TS) permanece ativo.
- O repositório contém dois projetos de site (pasta `orafaelferreira.com/` é o antigo Jekyll); a SPA atual está em `orafaelferreira-com/`.
- A pasta `infra/` possui `.gitignore` próprio para evitar que `.terraform/`, `*.tfstate` e `*.tfplan` entrem em commits. O lockfile `.terraform.lock.hcl` é versionado.
- A pipeline de deploy usa `npm install` ao invés de `npm ci` para maior flexibilidade quando há atualizações de dependências, evitando erros de sync entre `package.json` e `package-lock.json`.
