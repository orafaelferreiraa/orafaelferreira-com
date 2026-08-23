---
name: article-authoring-site-context
description: Write technical articles and blog posts for orafaelferreira.com following the site's Article model, markdown parser, and publication patterns.
---

# Article Authoring (Site Context)

## When to use

- Create a new article in `src/data/articles/`
- Refactor an existing article while keeping the site's editorial pattern
- Write longer blog posts that follow the technical article structure

## Goal

Generate content that matches the exact `Article` interface and uses markdown compatible with the site's parser.

## Embedded Resources

- `src/data/articles/types.ts`
- `src/lib/markdown.ts`
- `src/components/Talks.tsx`
- `ai/skills/blog-post-talks.SKILL.md`
- `ai/skills/blog-post-event-organization.SKILL.md`

## Structural Rules

- Export `export const article: Article = { ... }`
- Required fields: `slug`, `title`, `excerpt`, `content`, `date`, `category`, `readTime`
- Optional fields: `image`, `badges`, `tags`, `excludeTags`
- Use template strings for `content`
- Prefer `src/data/articles/artigos/*.ts` for technical articles
- Prefer `src/data/articles/blog-posts/*.ts` for posts and community records

## Completion Hints

| field | accepted values | example |
|-------|-----------------|---------|
| category | `Artigos`, `Posts`, `Palestras`, `Registro Eventos Presenciais`, `Organização de Eventos`, `Organizador Grupo de Comunidade`, `Certificações` | `Artigos` |

| field | accepted values | example |
|-------|-----------------|---------|
| category | `Artigos`, `Posts`, `Registro Eventos Presenciais`, `Organização de Eventos`, `Organizador Grupo de Comunidade`, `Certificações` | `Artigos` |
| readTime | `N min de leitura` or `N-M min de leitura` | `8 min de leitura` |
| date | ISO `YYYY-MM-DD` | `2026-04-18` |
| slug | kebab-case, no accents, no spaces | `docker-python-distroless-kubernetes` |

## Content Rules

- Never use the em dash (—) in the middle of a sentence; use a comma instead
- Use clear Portuguese
- Keep the tone practical and specific
- Explain context, decisions, trade-offs, and outcomes
- End with learnings and next steps
- Always include official source links for every protocol, tool, product, CLI, or spec cited in the article
- Place official links inline at the first mention of each technology/tool/spec in the body (avoid concentrating references only in a final section)
- Prefer primary docs from official maintainers (vendor docs, official spec site, official GitHub org/repo) over third-party blog references
- If the post comes from a talk, keep the official talk title exactly as the post title
- If the post includes community or event details, keep the links and references in the body as part of the story
- For talk/event posts with a matching entry in `src/components/Talks.tsx`, always sync cover image (`image`/`badges`) and slides link from Talks
- Never add a `## Agenda` (or `## Agenda do evento`) section with `**Sessão:**` / `**Palestrante:**` bold-label fields; weave the session/topic title and speaker(s) into the opening prose instead

## Markdown Compatibility

The parser supports:

- Headings `#`, `##`, `###`, `####`
- Bold, italics, lists, links, images, tables, code fences, inline code

Do not use:

- Footnotes
- Checkboxes
- Arbitrary HTML

## Quality Checklist

- Clear slug
- Useful excerpt for SEO
- Well-separated sections
- Official references included for all cited technologies
- Official references linked inline on first citation of tools/protocols/docs
- No `## Agenda` block with `**Sessão:**` / `**Palestrante:**` fields; session/speaker woven into prose
- No technical claims without evidence
- File name follows `YYYY-MM-DD-slug.ts`
- Talk/event posts reuse cover and slides from `src/components/Talks.tsx`