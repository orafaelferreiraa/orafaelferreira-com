---
name: site-improvement-backlog
description: Turn loose ideas about this site's UX, SEO, performance, or maintainability into a prioritized, executable backlog. Use when the user asks to audit the site, propose improvements, or turn scattered feedback into actionable tasks — not for a single isolated bug fix.
metadata:
  ported-from: ai/skills/site-improvement-backlog.SKILL.md
---

# Site Improvement Backlog

Adapted from this repo's `ai/` context kit for direct use in Claude Code. Read `ai/mcp/source-of-truth-policy.md` before validating any recommendation that depends on external/current information (library versions, Azure guidance) rather than repo state alone.

## When to use

- Evaluating the site's UX, performance, SEO, or reliability and proposing prioritized work
- Turning scattered ideas/feedback into an executable backlog

Require a specific focus area — refuse to produce a backlog for an unscoped "audit everything" without first narrowing scope (e.g. "SEO on article pages", "bundle size", "test coverage").

## Priority levels

- **P0**: functional breakage, regression, deploy-blocking
- **P1**: SEO, accessibility, core performance
- **P2**: incremental UX/content improvements
- **P3**: low-risk visual/technical polish

## Dimensions to check

- **Content**: clarity, consistency, technical currency — see `publishing-content` skill for the Article model itself
- **SEO**: metadata completeness, structure, discoverability — see `seo-structured-data` skill
- **Performance**: bundle size, rendering, image weight — see `performance-budget` skill
- **DevEx**: code conventions, test coverage, CI pipelines — see `testing-frontend` and `deploying-swa-terraform` skills

Reuse those skills' concrete facts (e.g. known i18n drift, missing article images, disabled E2E in CI) as backlog input instead of re-deriving them from scratch.

## Output format

A prioritized list with: `id`, `priority` (P0-P3), `title`, `impact`, `effort` (low/medium/high), `risk`, and a one-line technical justification per item. Any recommendation with an external dependency (library version, Azure behavior) must be checked against current documentation before being listed, not assumed from training data.
