# Research Components

After architecture planning, research each selected component to gather best practices before generating artifacts.

## Process

1. **Identify Components** — List all Azure services from architecture plan
2. **Load Service References** — For each service, load `services/<service>/README.md` first, then specific references as needed
3. **Check Resource Naming Rules** — For each resource type, check [resource naming rules](https://learn.microsoft.com/azure/azure-resource-manager/management/resource-name-rules) for valid characters, length limits, and uniqueness scopes
4. **Load Recipe References** — Load the selected recipe's guide (e.g., [AZD](recipes/azd/README.md)) and its IAC rules, MCP best practices, and schema tools listed in its "Before Generation" table
5. **Check Region Availability** — Verify all selected services are available in the target region per [region-availability.md](region-availability.md)
6. **Check Provisioning Limits** — Invoke **azure-quotas** skill to validate that the selected subscription and region have sufficient quota/capacity for all planned resources. Complete [Step 6 of the plan template](plan-template.md#6-provisioning-limit-checklist) in two phases: (1) prepare resource inventory with deployment quantities, (2) fetch quotas and validate capacity using azure-quotas skill
7. **Load Runtime References** — For containerized apps, load language-specific production settings (e.g., [Node.js](runtimes/nodejs.md))
8. **Invoke Related Skills** — For deeper guidance, invoke mapped skills from the table below
9. **Document Findings** — Record key insights in `.azure/deployment-plan.md`

## Service-to-Reference Mapping

> This fork keeps local references only for **Static Web Apps** (the service this
> project actually deploys). Other Azure services listed below have no local
> `services/<name>/` reference in this fork — research them via `ToolSearch`/
> `WebFetch` against Microsoft Learn if the app ever needs them instead of
> assuming a local file exists.

| Azure Service | Reference | Related Skills |
|---------------|-----------|----------------|
| **Hosting** | | |
| Static Web Apps | [Static Web Apps](services/static-web-apps/README.md) | — |
| Container Apps, App Service, Azure Functions, AKS | — (no local reference in this fork) | `azure-diagnostics`, `azure-observability`, `azure-nodejs-production`, `azure-networking` |
| **Data** | | |
| Azure SQL, Cosmos DB, PostgreSQL, Storage (Blob/Files) | — (no local reference in this fork) | `azure-storage` |
| **Messaging** | | |
| Service Bus, Event Grid, Event Hubs | — (no local reference in this fork) | — |
| **Integration** | | |
| API Management | [APIM](apim.md) | `azure-aigateway` (invoke for AI Gateway policies) |
| Logic Apps | — (no local reference in this fork) | — |
| **Workflow & Orchestration** | | |
| Durable Functions, Durable Task Scheduler | — (no local reference in this fork) | — |
| **Security & Identity** | | |
| Key Vault | — (no local reference in this fork) | `azure-keyvault-expiration-audit` |
| Managed Identity | — | `entra-app-registration` |
| **Observability** | | |
| Application Insights | — (no local reference in this fork) | `appinsights-instrumentation` (invoke for instrumentation) |
| Log Analytics | — | `azure-observability`, `azure-kusto` |
| **AI Services** | | |
| Azure OpenAI | — (no local reference in this fork) | `microsoft-foundry` (invoke for AI patterns and model guidance) |
| AI Search | — | `azure-ai` (invoke for search configuration) |

## Research Instructions

### Step 1: Load Internal References (Progressive Loading)

For each selected service, load the README.md first, then load specific files as needed:

```
Selected: Static Web Apps

→ Load: services/static-web-apps/README.md (overview)
  → If need Terraform: services/static-web-apps/terraform.md
  → If need routing: services/static-web-apps/routing.md
  → If need deployment details: services/static-web-apps/deployment.md
```

For any other service, there's no local reference in this fork — research it
fresh via `ToolSearch`/`WebFetch` against Microsoft Learn.

### Step 2: Invoke Related Skills (When Deeper Guidance Needed)

Invoke related skills for specialized scenarios:

| Scenario | Action |
|----------|--------|
| **Using GitHub Copilot SDK** | **Invoke `azure-hosted-copilot-sdk`** (scaffold + config, then resume azure-prepare) |
| PostgreSQL with passwordless auth | Handle directly without a separate skill |
| Need detailed security hardening | Handle directly with service-specific security guidance and platform best practices |
| Setting up App Insights instrumentation | `appinsights-instrumentation` |
| Building AI applications | `microsoft-foundry` |
| Cost-sensitive deployment | `azure-cost` |

**Skill/Reference Invocation Pattern:**

For **PostgreSQL**:
1. Handle passwordless auth patterns directly without a separate skill

### Step 3: Document in Plan

Add research findings to `.azure/deployment-plan.md` under a `## Research Summary` section with source references and key insights per component.

## Common Research Patterns

> The worked patterns below (Container Apps, SQL, Cosmos DB, Functions, AI
> workloads) were removed from this fork along with their service references
> — this project only deploys a static frontend to Static Web Apps. If a
> future project in this repo needs one of those services, research it fresh
> via `ToolSearch`/`WebFetch` rather than assuming a local pattern exists.

### Static Web Apps (this project)

1. Load: [services/static-web-apps/README.md](services/static-web-apps/README.md) → [terraform.md](services/static-web-apps/terraform.md)
2. Review [routing.md](services/static-web-apps/routing.md) and [region-availability.md](services/static-web-apps/region-availability.md) as needed

### GitHub Copilot SDK Application

1. Invoke: `azure-hosted-copilot-sdk` skill (scaffold, infra, model config)
2. After it completes, resume azure-prepare workflow (validate → deploy)

## After Research

Proceed to **Generate Artifacts** step with research findings applied.
