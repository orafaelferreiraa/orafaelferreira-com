---
name: blog-post-event-organization
description: Write blog posts about organizing community events, meetups, and conferences with an operational, behind-the-scenes angle.
---

# Blog Post de Organização de Eventos

## When to use

- Write about organizing a meetup, conference, community session, or in-person event
- Document planning, logistics, operations, and lessons learned

## Goal

Produce a post that is useful for future organizers and shows the real operational work behind the event.

## Embedded Resources

- `ai/skills/article-authoring-site-context.SKILL.md`
- `src/data/articles/types.ts`
- `src/lib/markdown.ts`
- `src/components/Talks.tsx`

## Editorial Rules

- Focus on organization, not self-promotion
- Explain venue, agenda, speakers, communication, registration, and contingency planning
- Capture what worked, what failed, and what should change next time
- If the event included your own talk, keep that as context rather than the entire story
- Add official links inline at first mention for technologies/tools/protocols cited in the post
- If the event exists in `src/components/Talks.tsx`, reuse the same `image` and `slidesUrl` when present
- Include an explicit agenda section in every event post with talk title, speaker name, and a short summary for each session
- When speaker social links are available (for example LinkedIn), include them in markdown next to each speaker

## Mandatory Sync with Talks

When the organized event has a corresponding entry in `src/components/Talks.tsx`:

1. Reuse `Talks.image` as the post cover in metadata (`badges[0].image` preferred).
2. If `Talks.slidesUrl` exists, include a `## Slides` section using that exact link.
3. If `Talks.repositories` exists, preserve labels/URLs in `## Repositories`.
4. Never create new slide/repository links that are not in Talks.

## Recommended Structure

- Event context and goal
- Your role in the organization
- Planning: timeline, partners, budget, venue, outreach
- Execution: check-in, schedule, speaker support, fallbacks
- Community impact and results
- Lessons learned and improvement ideas
- Next steps or invitation to future events

## Completion Hints

| field | guidance |
|-------|----------|
| category | prefer `Organização de Eventos` or `Organizador Grupo de Comunidade` |
| excerpt | mention the event type, main challenge, and practical lesson |
| tags | community, meetup, event, speaker, organization, logistics, planning |

## Quality Checklist

- Practical language
- Clear operational detail
- Useful for other organizers
- Calm, factual, and specific
- Official references linked inline where technical tools/protocols are cited
- Agenda section present in the post body
- Event cover and slides aligned with `src/components/Talks.tsx` when available