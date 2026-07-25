# Terraform Deploy Recipe

Deploy to Azure using Terraform.

## Prerequisites

- Terraform CLI installed
- `.azure/deployment-plan.md` exists with status `Validated`
- Terraform initialized (`terraform init`)
- Plan validated (`terraform plan`)
- **Subscription and location confirmed** → See [Pre-Deploy Checklist](../../pre-deploy-checklist.md)

## Workflow

| Step | Task | Command |
|------|------|---------|
| 1 | **[Pre-deploy checklist](../../pre-deploy-checklist.md)** | Confirm subscription/location with user |
| 2 | Select workspace | `terraform workspace select <env>` |
| 3 | Apply | `terraform apply tfplan` |
| 4 | Get outputs | `terraform output` |
| 5 | Deploy app | Service-specific commands |
| 6 | **Report** | Present deployed endpoint URLs to the user — see [Verification](verify.md) |

## Deployment Commands

### Apply with Plan File (Recommended)

```bash
terraform plan -out=tfplan
terraform apply tfplan
```

### Auto-Approve (CI/CD)

```bash
terraform apply -auto-approve
```

### With Variables

```bash
terraform apply \
  -var="environment=prod" \
  -var="location=westus2" \
  -auto-approve
```

### Target Specific Resource

```bash
terraform apply -target=azurerm_container_app.api
```

## Get Outputs

```bash
terraform output
terraform output -json
terraform output api_url
```

## References

- [Verification steps](./verify.md)
- [Error handling](./errors.md)
