---
name: deploying-swa-terraform
description: Understand or change this site's actual Azure deployment path — Terraform-managed Azure Static Web App plus GitHub Actions, not azd. Use when the user asks about deploying, infra, Terraform, DNS, custom domain, or CI/CD for this repo, or before reaching for the generic azure-prepare/azure-deploy/azure-validate skills, which assume an azd workflow this project does not use.
---

# Deploying (Terraform + Azure Static Web Apps)

This project has **no `azure.yaml` and no `.azure/` folder** — it does not use `azd`. Deployment is Terraform for infra + a GitHub Actions workflow that uploads the built `dist/` to an existing Azure Static Web App. If a task looks like "deploy this site", it means working with `infra/*.tf` and `.github/workflows/`, not the generic azd-based Azure skills.

## Infra (`infra/*.tf`)

- **Provider aliases**: `azurerm.site` (subscription with the app + its resource group `rg-site`) and `azurerm.dns` (subscription with the `orafaelferreira.com` DNS zone, resource group `rg-orafaelferreira.com`) — two subscriptions, set via `site_subscription_id`/`dns_subscription_id` variables. Get the alias wrong and Terraform looks in the wrong subscription.
- **Resources**: one `azurerm_static_web_app` (`swa-site-orafael`, `eastus2`, Free tier) + DNS: `www` CNAME, apex `A` record pointing at the SWA, both wired to `azurerm_static_web_app_custom_domain` (CNAME delegation for `www`, DNS-TXT-token validation for the apex — the apex additionally needs an `azapi_resource` TXT record merging the validation token with `apex_base_txt_records`, e.g. the existing SPF record, so don't let the validation token silently replace other TXT values at the apex).
- **State**: remote backend in `azurerm`, storage account `stostateorafael`, container `statetf`, key `infra.terraform.tfstate`, `use_azuread_auth = true` (no storage key in the repo).

## CI/CD (`.github/workflows/`)

| Workflow | Trigger | Does |
|---|---|---|
| `infra-plan.yml` | PR touching `infra/` | `terraform plan` |
| `infra-apply.yml` | push to `main` touching `infra/` | `terraform apply`, then triggers `deploy-app` |
| `deploy-app.yml` | push to `main` touching `src/`/`scripts/`/`e2e/`/build config, or after `infra-apply` succeeds, or manual dispatch | `npm install` → unit tests → component tests → typecheck → `npm run build` → `Azure/static-web-apps-deploy@v1` (`action: upload`, `app_location: dist`, `skip_app_build: true` — the build already happened in the job, SWA just serves the static output) |
| `regenerate-event-schedule.yml`, `sync-talks-on-event-day.yml` | scheduled/cron | content automation (see `scripts/generate-event-schedule.mjs`, `scripts/sync-talks-and-events.mjs`), independent of infra/app deploy |

`deploy-app` deploys on **every** relevant push to `main` directly — there is no separate staging environment or manual approval gate in this repo.

## When a generic Azure skill would be wrong here

`azure-prepare`/`azure-deploy`/`azure-validate` assume `azd up`/`azd deploy` against a `.azure/deployment-plan.md` this repo doesn't have. If one of those skills' triggers seem to match ("deploy to Azure Static Web Apps", "terraform apply"), prefer this skill's actual workflow instead — running `azd` commands here has nothing to attach to.
