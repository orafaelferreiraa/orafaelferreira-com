---
name: microsoft-docs
description: Query official Microsoft documentation for current Azure, .NET, Windows, and Microsoft platform guidance.
---

# Microsoft Docs

Use this skill whenever a task depends on current Microsoft guidance rather than cached knowledge.

## Use it for

- concepts and architecture guidance
- configuration options and limits
- tutorials and quickstarts
- best practices and breaking changes

## Workflow

1. Search Microsoft Learn first — if a Microsoft Learn MCP server is
   connected, run `ToolSearch("microsoft learn")` to find its real tool name
   (`mcp__<server>__...`) and use it. If none is connected, use `WebSearch`/
   `WebFetch` scoped to `learn.microsoft.com`.
2. Fetch full pages when the excerpt is not enough.
3. Prefer official docs over blog posts when there is a conflict.

## Good queries

- "Azure Static Web Apps custom configuration"
- "Application Insights JavaScript SDK setup"
- "Terraform azurerm provider latest version"