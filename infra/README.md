# Infra (Terraform) for Azure Static Web Apps

This folder contains Terraform to provision:
- An Azure Static Web App (SWA) in an existing Resource Group

## Remote state (Azure Storage)

O state do Terraform é armazenado em uma Storage Account (container de blobs). A configuração está no arquivo `backend.tf`:

- Storage Account: `stostateorafael`
- Container: `statetf`
- Resource Group: `rg-site`
- Key: `infra.terraform.tfstate`

Recomendado no Storage Account:
- Habilitar versioning de blobs e soft delete para proteção do state.
 - Usar RBAC com Azure Identity, sem chaves de conta (backend usa `use_msi = true` quando executado em ambiente Azure). Em runners hospedados do GitHub, utilize identidade federada (OIDC) em vez de MSI.

Execução local (requer Azure CLI login):

```bash
az login
terraform init
```

## Variables

Provide these values via `-var` flags, environment variables, or a `terraform.tfvars` file:

- `resource_group_name` (string, required): Name of an EXISTING Resource Group (e.g., `rg-site`)
- `static_site_name` (string, required): Globally unique SWA name (e.g., `rbb-portfolio-swa`)
- `location` (string, default `eastus`): Not used when RG is external; location is inferred from the RG
- `swa_sku_tier` (string, default `Free`): `Free` or `Standard`
- `swa_sku_size` (string, default `Free`)

Example `terraform.tfvars`:

resource_group_name = "rg-site"
static_site_name    = "rbb-portfolio-swa"
location            = "eastus"

## Local usage

```bash
terraform init
terraform plan -var "resource_group_name=rbb-portfolio-rg" -var "static_site_name=rbb-portfolio-swa"
terraform apply -auto-approve -var "resource_group_name=rbb-portfolio-rg" -var "static_site_name=rbb-portfolio-swa"
```

## Terraform docs (auto)

Este repositório usa `terraform-docs` via GitHub Actions para gerar/atualizar a documentação de variáveis, saídas e recursos abaixo. O conteúdo entre os marcadores será atualizado automaticamente em pushes para `main`.

### Referência do módulo

<!-- BEGIN_TF_DOCS -->
<!-- END_TF_DOCS -->

## GitHub Actions (infra.yml)

- Triggers only when files under `infra/` change (push/PR to `main`).
- Uses OIDC to login to Azure. You must create the federated credentials and set repository secrets:
  - `AZURE_CLIENT_ID`
  - `AZURE_TENANT_ID`
  - `AZURE_SUBSCRIPTION_ID`
  
Além disso, a pipeline:
- Gera a documentação com `terraform-docs`.
- Commita e faz push das mudanças do README de docs somente em pushes (não em PRs).

## App CI/CD (deploy-app.yml)

- Triggers on site changes (src/, public/, configs) and ignores `infra/`.
- Builds with Node 20 and uploads `dist/` to SWA using `Azure/static-web-apps-deploy`.
- Requires repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN` from the SWA resource in Azure.

## Notes

- Container files were deprecated; hosting is through Azure Static Web Apps.
- For custom domains and TLS, configure in the SWA resource after provisioning.
