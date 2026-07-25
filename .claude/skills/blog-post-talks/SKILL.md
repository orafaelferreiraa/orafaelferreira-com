---
name: blog-post-talks
description: Turn talks, conference sessions, and workshops into blog posts that preserve the site's legacy links, slides, and repository structure.
---

# Blog Post de Palestra

## When to use

- Turn a talk, workshop, or conference session into a blog post
- Publish an announcement or recap of a presentation

## Goal

Create a talk-based post with the official talk title preserved and the old site template kept intact.

## Embedded Resources

- `ai/skills/article-authoring-site-context.SKILL.md`
- `src/data/articles/types.ts`
- `src/lib/markdown.ts`
- `src/components/Talks.tsx`

## Editorial Rules

- The post title must exactly match the talk title
- Keep the official event name and city when available
- Use a first-person, practical tone
- Do not invent links, slides, or repositories
- Add official links inline at the first mention of each cited technology/tool/protocol in the post body
- If the talk exists in `src/components/Talks.tsx`, reuse exactly the same `image` and `slidesUrl`

## Mandatory Sync with Talks

Before writing or updating a talk-based post:

1. Find the corresponding entry in `src/components/Talks.tsx` by title/event/date.
2. Use the same event cover in the article metadata, preferring:
	- `badges: [{ image: "<Talks.image>" }]` for card cover consistency, or
	- `image: "<Talks.image>"` when needed for OG fallback.
3. In `## Slides`, use the same URL from `Talks.slidesUrl`.
4. If `Talks.repositories` exists, mirror labels and URLs in `## Repositories`.
5. If the talk has no slides in Talks, omit `## Slides` (never invent links).
6. Ensure the post body contains event and social links in markdown format:
	- event/site link from `Talks.siteUrl`
	- LinkedIn link from `Talks.linkedinUrl` when available, using the legacy label pattern (for example: `LinkedIn Post Divulgação evento` or `Post Linkedin`)
7. Ensure `Talks.blogUrl` points to the published post URL (`https://www.orafaelferreira.com/artigos/<slug>`).

## Required Structure

- Short opening with the talk context
- Event or meetup link in markdown when available
- LinkedIn link in markdown when available
- `## Agenda` (or `## Agenda do evento`) with session title, speaker, and short summary
- `## Slides` with a named link
- `## Repositories` with named links when available
- Main learnings, demo notes, or community impact

## Legacy Pattern to Preserve

- Meetup / event / LinkedIn links stay as markdown links
- Slides must not be pasted as a naked URL
- Repositories must be listed with human-friendly labels
- Omit the repositories section entirely if there are no repositories
- Keep bidirectional linking: Talks entry links to the blog post via `blogUrl`, and the post links back to the event page.

## Completion Hints

| field | guidance |
|-------|----------|
| category | prefer `Posts` for announcements/recaps, or `Registro Eventos Presenciais` when the focus is attendance and event context |
| excerpt | 1-2 sentences summarizing the talk thesis and value |
| tags | highlight Azure, DevOps, IA, Cloud Foundation, Security, Community when applicable |

## Quality Checklist

- Official title preserved
- Links coherent and verified
- Official references linked inline where technologies/tools are first cited
- Agenda section present in the post body
- Cover image and slides synchronized with `src/components/Talks.tsx`
- Concise, technical, and human
- No promotional fluff