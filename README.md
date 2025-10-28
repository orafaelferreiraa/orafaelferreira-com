# rafael-builds-bridges

Portfólio/SPA em Vite + React + TypeScript, hospedado na Azure Static Web Apps com CI/CD via GitHub Actions e infraestrutura em Terraform.

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

O deploy é automático no push para `main` quando arquivos do app mudam (`src/`, `public/`, `index.html`, configs). Workflow: `.github/workflows/deploy-app.yml`.

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
- Roda apenas quando `infra/**` muda (push/PR)
- Autenticação Azure por Service Principal. Adicione os secrets:
	- `AZURE_CLIENT_ID`
	- `AZURE_TENANT_ID`
	- `AZURE_SUBSCRIPTION_ID`
	- `AZURE_CLIENT_SECRET`
- Executa `init/fmt/validate/plan/apply`
- Gera e injeta documentação com `terraform-docs` automaticamente no `infra/README.md` (commita no push)

## domínios e HTTPS

Configure domínio custom e TLS diretamente no recurso do SWA após o provisionamento.

## notas

- Arquivos de Docker foram descontinuados (não necessários para SWA).
- A pasta `infra/` só dispara pipeline quando for alterada; o app só quando os arquivos do site mudarem.
