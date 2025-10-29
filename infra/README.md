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
- Usar RBAC com Azure AD (sem chaves de conta). Backend configurado com `use_azuread_auth = true`.
- Conceder ao Service Principal o papel "Storage Blob Data Contributor" neste Storage Account (ou no container `statetf`).

Execução local (Service Principal):

```bash
export ARM_CLIENT_ID=<appId-do-SP>
export ARM_CLIENT_SECRET=<clientSecret-do-SP>
export ARM_TENANT_ID=<tenantId>
export ARM_SUBSCRIPTION_ID=<subscriptionId>
cd infra
terraform init
terraform plan -var "resource_group_name=rg-site" -var "static_site_name=<nome-unico>"
terraform apply -auto-approve -var "resource_group_name=rg-site" -var "static_site_name=<nome-unico>"
cd -
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
## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement\_terraform) |  1.13.4 |
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

No inputs.

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_static_site_default_hostname"></a> [static\_site\_default\_hostname](#output\_static\_site\_default\_hostname) | Default hostname of the Static Web App |
| <a name="output_validation_token"></a> [validation\_token](#output\_validation\_token) | Validation token for the custom domain DNS TXT record |
<!-- END_TF_DOCS -->

## GitHub Actions (infra.yml)

- Triggers only when files under `infra/` change (push/PR to `main`).
- Usa Service Principal para login no Azure e para o Terraform provider. Crie um App Registration e salve estes secrets no repositório:
  - `AZURE_CLIENT_ID` (Application ID)
  - `AZURE_TENANT_ID` (Tenant ID)
  - `AZURE_SUBSCRIPTION_ID` (Subscription ID)
  - `AZURE_CLIENT_SECRET` (Client Secret do SP)

Além disso, a pipeline:
- Gera a documentação com `terraform-docs`.
- Commita e faz push das mudanças do README de docs somente em pushes (não em PRs).

### Vinculando o GitHub ao SWA

Após o `terraform apply`, você precisa conectar o repositório GitHub ao Static Web App:

1. **Obter o deployment token (API key)**:
   ```bash
   cd infra
   terraform output -raw static_site_api_key
   ```

2. **Adicionar secret no GitHub**:
   - Vá em Settings → Secrets and variables → Actions
   - Crie o secret `AZURE_STATIC_WEB_APPS_API_TOKEN` com o valor do output acima

3. **Deploy automático**:
   - O workflow `.github/workflows/deploy-app.yml` já está configurado
   - Quando você fizer push de mudanças no app, ele automaticamente faz build e deploy para o SWA
   - PRs criam ambientes de preview automaticamente


## App CI/CD (deploy-app.yml)

- Triggers on site changes (src/, public/, configs) and ignores `infra/`.
- Builds with Node 20 and uploads `dist/` to SWA using `Azure/static-web-apps-deploy`.
- Requires repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN` from the SWA resource in Azure.

## Notes

- Container files were deprecated; hosting is through Azure Static Web Apps.
- For custom domains and TLS, configure in the SWA resource after provisioning.
