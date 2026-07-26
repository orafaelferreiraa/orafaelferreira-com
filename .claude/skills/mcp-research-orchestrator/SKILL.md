---
name: mcp-research-orchestrator
description: Produce a source-backed research package via MCP tools (Context7, Microsoft Learn, GitHub, Terraform registry) before writing or updating a technical article for this site. Use when creating a new technical article, updating one after a stack change, or making a site-improvement recommendation that depends on external/current reference material.
metadata:
  ported-from: ai/skills/mcp-research-orchestrator.SKILL.md
---

# MCP Research Orchestrator

Adapted from this repo's `ai/` context kit. Read `ai/mcp/source-of-truth-policy.md` and `src/data/articles/types.ts` (the `Article` interface) before starting — every claim produced here should end up traceable to a source, and the output should slot directly into an `Article.content`.

## When to use

- Creating a new technical article in `src/data/articles/artigos/`
- Updating an existing article after a stack/version change
- Any site-improvement recommendation that depends on external reference material rather than repo state

## Required inputs

- **topic**: specific, not vague — "Azure Container Apps with Dapr" is usable, "cloud" alone is not
- **target audience**: technical level + role (e.g. "mid-level platform engineer")
- optional: **depth** (beginner/intermediate/advanced, default intermediate), **scope** (conceptual/tutorial/hands-on/comparative)

Reject a vague topic before researching — ask for a narrower one instead of guessing.

## Research steps (use the actual MCP tool, fully qualified by server name)

1. **Library/product docs** — resolve the library, pull current API/examples/breaking changes via the Context7 MCP tools available in this session.
2. **Microsoft Learn** — confirm official guidance and architecture recommendations, extract security/operational best practices, via the Microsoft Learn MCP tools.
3. **GitHub** — search real, active code for implementation patterns and pitfalls.
4. **Terraform registry** — verify provider/resource names, parameters, and current versions if the article touches IaC.
5. **Consolidate** — write an objective technical summary, separate facts (sourced) from opinion, and confirm every claim has a source before handing off to writing.

## Output shape

- Executive summary (5-8 lines)
- Evidence grouped by source (library docs / Microsoft Learn / GitHub / Terraform registry)
- Top 5 pitfalls to avoid
- Final recommendation, ready to become article content per `publishing-content`
