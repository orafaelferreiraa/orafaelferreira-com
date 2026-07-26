---
name: azure-gcp-de-para-article
description: Add or review an Azure-to-GCP service equivalence ("de-para") section in a technical article on orafaelferreira.com — a comparison table plus practical differences, framed as trade-offs rather than marketing claims. Use when writing or updating an article whose primary subject is an Azure resource/service/architecture, or when reviewing Azure-centric technical content for a multi-cloud comparison.
---

# Azure↔GCP De-Para for Articles

Ported from `ai/skills/azure-gcp-de-para-article.SKILL.md` into Claude Code skill format.
Pairs with `article-authoring-site-context` (editorial rules) and `mcp-research-orchestrator`
(sourcing) — use all three together when writing an Azure-centric article.

## When to use

- Writing an article about an Azure resource, service, or architecture
- Updating an existing Azure article to add a multi-cloud comparison
- Reviewing Azure-centric technical text to make GCP equivalences explicit

## When not to use

- Articles unrelated to cloud
- Purely opinion pieces with no technical substance
- Comparisons that would require a formal benchmark you don't have real data for

## Goal

Every article centered on an Azure service should include a clear de-para with GCP,
highlighting real equivalences, behavioral differences, and the limits of the comparison —
never implying full parity where there isn't any.

## Before writing

Load `article-authoring-site-context`'s editorial rules, `ai/mcp/source-of-truth-policy.md`
for sourcing rules, and `TECH_STACK.md` for project context.

## Required rules

- For every Azure resource that's a primary subject of the article, map the GCP equivalent.
- Always flag partial equivalence — never claim full parity.
- Explain differences across at least 3 dimensions: operation, pricing, technical limits.
- Include official links inline at the first mention of both the Azure and GCP service.
- Prefer primary sources: official Azure docs and official Google Cloud docs.
- Avoid marketing language; focus on technical decision-making and trade-offs.

## Recommended article structure

1. Problem context on Azure
2. Azure solution (with examples)
3. `## De-para Azure and GCP` section
4. Practical implementation differences
5. Risks, lock-in, and operational costs
6. Conclusion with a decision criterion

## De-para section template

```md
## De-para Azure and GCP

| Scenario | Azure | GCP | Practical notes |
|---|---|---|---|
| Serverless compute | Azure Functions | Cloud Functions | Trigger model, timeout, concurrency, and cold start differ |
| Managed containers | Azure Container Apps | Cloud Run | Scale-to-zero, networking, and observability vary |
| Managed Kubernetes | Azure Kubernetes Service (AKS) | Google Kubernetes Engine (GKE) | Autopilot/operation mode and base cost differ |
| Messaging | Azure Service Bus | Pub/Sub | Delivery semantics, ordering, and dead-lettering differ |
| Managed relational DB | Azure SQL Database | Cloud SQL | HA, replicas, and tuning differ per engine |
| Observability | Azure Monitor + Application Insights | Cloud Monitoring + Cloud Logging | Collection model and integration differ |
| Identity and access | Microsoft Entra ID + RBAC | Cloud IAM | Permission scope and governance model differ |
```

## Quality checklist

- Explicit `## De-para Azure and GCP` section is present
- Every central Azure service in the text has a GCP counterpart or a stated justification for its absence
- Each de-para row states whether the equivalence is full, partial, or approximate only
- Official links are present for every service cited
- The text describes at least one migration risk or lock-in consideration

## Completion hints

| field | guidance |
|---|---|
| `category` | prefer `Artigos` when it's an in-depth technical comparison |
| `tags` | include `Azure`, `GCP`, `Cloud`, `Arquitetura`, plus the specific topic |
| `excerpt` | explicitly mention that the article includes an Azure×GCP de-para |

## Technical rigor notes

- Never assume equivalence from product naming alone.
- If GCP has multiple options for one Azure resource, list the primary one and mention alternatives.
- When there's no direct equivalent, state `no direct equivalent` and suggest a service composition instead.
