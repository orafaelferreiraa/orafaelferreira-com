---
name: article-images
description: Add a cover image plus 3 inline illustrations (with descriptions/alt text and AI image-generation prompts) to a technical article or blog post on orafaelferreira.com. Use when finishing or reviewing an article draft, when the user asks to "add images", "gerar imagens", "criar capa", or an article has no image/visual breaks in its content.
---

# Article Images

This site has no image-generation tool wired into Claude Code and no `OPENAI_API_KEY`/`GEMINI_API_KEY` configured by default — check `env | grep -iE "OPENAI|GEMINI|GOOGLE_API"` before assuming otherwise. The deliverable from this skill is normally **prompts + placement + alt text**, handed to the user to generate manually in ChatGPT/Gemini and send back (or upload themselves), not generated images. Only call an image-gen API directly if the user has already supplied a key for this session.

## What "done" looks like

One article gets **4 images**: a cover (`image` field, used for og:image/Twitter/thumbnail) + 3 inline illustrations placed inside `content`. This only applies to conceptual/technical articles that don't already have their own real screenshots or certificates to show (see `publishing-content` skill) — don't add illustrative images to a certification-journey or event-recap post that's already carrying photos/certificate screenshots as its visual content.

## 1. Pick placement before writing prompts

Don't distribute images evenly by paragraph count — anchor each one to a specific idea the article is actually arguing, at a natural section boundary (end of a bullet list, end of a subsection, before a new `##`/`###`). Read the whole article first and pick:

- **Cover**: the single idea that best summarizes the article's thesis or title metaphor. Not just "a laptop with code" — find the actual hook.
- **3 inline images**: one early (reinforces a core concept right after it's introduced), one in the middle (usually the most mechanism-heavy section — diagrams read better than more prose), one late (reinforces the article's key distinction or conclusion, e.g. right before the wrap-up section).

## 2. Write the alt text / description (Portuguese)

Follow the site's existing convention (see any file under `src/data/articles/artigos/` with `![...]`) — a short, literal, descriptive sentence in Portuguese naming what's depicted, not a caption or a joke. This is what screen readers and `alt` see, so it must stand on its own.

## 3. Write the generation prompt (English)

Image models follow English prompts more reliably and consistently render text/letters wrong — so:

- **Always include**: no readable text, no letters, no numbers, no UI screenshots in the image (unless the point of the image genuinely is a UI screenshot, which is rare for this site's conceptual illustrations).
- **Keep a consistent visual language across all 4 images of one article** — same palette (e.g. dark navy/charcoal background with one accent color), same style (flat vector / iconographic, not photorealistic), so they read as a set. Name the specific style and colors in every prompt rather than leaving it to the model to reinterpret each time.
- **Describe composition explicitly**: what's in the foreground, what's iconography vs. background texture, where the negative space is (the cover needs clear negative space for potential text/logo overlay in social previews).
- **Aspect ratio**: 16:9 for both cover and inline images, consistent with how this site's content column renders images.
- Ground the visual metaphor in something the article actually says (a specific mechanism, table, or distinction it draws) — not a generic "AI robot" stock-photo trope.

## 4. Insert into the article

- Cover: set `image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/<slug>/capa.png"` in the `Article` object (see `publishing-content` skill for the field's role — it gates whether OG/Twitter meta tags render at all).
- Inline: `![<alt text in Portuguese>](https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/<slug>/1.png)` (then `2.png`, `3.png`) at the chosen placements, as their own line in the markdown content.
- This blob container is external to the repo — the URL is written before the file necessarily exists there. Tell the user explicitly which local files need to end up at which blob path once generated (upload is normally a manual/`az storage blob upload` step outside this skill unless the user asks you to run it).

## 5. Validate

```bash
node .claude/skills/publishing-content/scripts/check-article.mjs src/data/articles/artigos/your-file.ts
npm run typecheck
```

The checker warns on missing `image` but doesn't verify inline image count or that the blob URLs actually resolve — that's on you to confirm once the files are uploaded.
