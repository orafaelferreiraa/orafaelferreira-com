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

## domínios e HTTPS

Configure domínio custom e TLS diretamente no recurso do SWA após o provisionamento.

## notas

- Lint no CI foi desabilitado para evitar ruído causado por conteúdo em markdown inline nos arquivos de artigos. O typecheck (TS) permanece ativo.
- O repositório contém dois projetos de site (pasta `orafaelferreira.com/` é o antigo Jekyll); a SPA atual está em `orafaelferreira-com/`.
- A pasta `infra/` possui `.gitignore` próprio para evitar que `.terraform/`, `*.tfstate` e `*.tfplan` entrem em commits. O lockfile `.terraform.lock.hcl` é versionado.
