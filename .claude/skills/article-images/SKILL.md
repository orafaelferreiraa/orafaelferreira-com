---
name: article-images
description: Add a cover image plus 3 inline illustrations (with descriptions/alt text and AI image-generation prompts) to a technical article or blog post on orafaelferreira.com. Use when finishing or reviewing an article draft, when the user asks to "add images", "gerar imagens", "criar capa", or an article has no image/visual breaks in its content.
---

# Article Images

This site has no image-generation tool wired into Claude Code and no `OPENAI_API_KEY`/`GEMINI_API_KEY` configured by default — check `env | grep -iE "OPENAI|GEMINI|GOOGLE_API"` before assuming otherwise. The deliverable from this skill is normally **prompts + placement + alt text**, handed to the user to generate manually in ChatGPT/Gemini and send back (or upload themselves), not generated images. Only call an image-gen API directly if the user has already supplied a key for this session.

## What "done" looks like

One article gets **4 images**: a cover (`image` field, used for og:image/Twitter/thumbnail) + 3 inline illustrations placed inside `content`. This only applies to conceptual/technical articles that don't already have their own real screenshots or certificates to show (see `publishing-content` skill) — don't add illustrative images to a certification-journey or event-recap post that's already carrying photos/certificate screenshots as its visual content.

## The format: dense technical infographic, not abstract art

This is the single thing to get right, and it is the opposite of the usual "no text in AI images" advice.

Every image is a **designed infographic that carries real information from the article**: real headings, real Portuguese labels, real official project logos, real values. Think well-designed conference slide or product one-pager, not conceptual illustration. A reader should learn something from the image without reading the paragraph next to it.

**Reference examples from this site** (look at them before writing prompts): the cover of `/artigos/terraform-mcp-server-docker` (title block, left column of labelled benefit rows, isometric center diagram, tool cards, terminal block, footer callout) and the split before/after cover of `/artigos/terraform-site`.

What this rules out, all of which has been explicitly rejected here:

- **Abstract metaphor art.** Glowing threads, faceted prisms, energy tokens falling into receptacles, polyhedral nodes. Reads as generic AI stock art and says nothing about the article.
- **Text-free minimalism.** Stripping labels turns a diagram into decoration. Text is expected and models render it well enough when the exact strings are given.
- **Icon legend sheets.** Never put a reusable "icon vocabulary" block into a prompt as reference material — the model renders the vocabulary itself, and you get a grid of icons in circles instead of an illustration. Describe each icon inline, at the spot in the layout where it belongs.

## 1. Pick placement before writing prompts

Anchor each image to a specific idea the article is arguing, at a natural section boundary (end of a bullet list, end of a subsection, before a new `##`/`###`). Don't distribute evenly by paragraph count. Read the whole article first and pick:

- **Cover**: the article's thesis, with its title typeset into the image.
- **3 inline**: one early (the core concept, right after it's introduced), one in the middle (the most mechanism-heavy section — a diagram beats more prose), one late (the key distinction or the payoff finding, before the wrap-up).

## 2. Style block (paste at the top of every prompt in the set)

Keeps the four images reading as one set:

> Dark navy technical infographic, 16:9, high information density, like a well-designed conference slide. Background: deep navy gradient with a faint circuit-board texture and ghosted code-editor panels in the corners. Accents: electric cyan, bright blue, violet. Content sits in dark rounded cards with thin glowing borders. Thin-line outlined icons inside circles. Clean geometric sans-serif: white headings with key words highlighted in cyan or violet, light grey body text. Use the real official logos for <the projects the article is actually about>. All text in Brazilian Portuguese, spelled exactly as written below.

Name the actual projects (Kubernetes, Docker, Terraform, Azure, NGINX, Envoy, CNCF, GitHub Actions…). Real logos are wanted; the model approximates them, and that is accepted here.

## 3. Layout recipes

Pick the recipe that matches what the section argues. All four end with a **full-width footer bar carrying one sentence lifted from the article** — that bar is what makes the image quotable on LinkedIn.

- **Cover**: title block top-left (article title, with the key term in cyan) + subtitle; left column of ~5 icon rows, each an outlined icon plus a colored ALL-CAPS heading plus one grey line; center isometric diagram showing the article's main flow with labelled inputs and outputs; footer bar.
- **Taxonomy / fan-out** (a contract, a list of buckets, a set of options): one input card at the top, a small splitter node, then N labelled cards in a row, each icon + ALL-CAPS heading + one description line. Outline the exceptional card in violet so it stands out. Footer bar.
- **Split comparison** (X versus Y, cheap versus expensive, before the fix versus after): vertical divider, two panels with their own header + logo, cyan checkmark rows for what each one gives you and one violet X row for what it does not. Footer bar naming the trade-off.
- **Before/after flow** (a bug and its fix, a migration): two horizontal lanes tagged "ANTES" (muted red) and "DEPOIS" (cyan), each a full left-to-right flow through the same nodes, with the broken path drawn as a dashed line that breaks apart and the fixed path solid. Footer bar.

## 4. Text inside the image

- **Portuguese, exact strings, quoted in the prompt.** Write out every heading, label, chip and footer sentence verbatim so the model copies rather than invents.
- **Short.** Headings 1-4 words in caps; descriptions one line; footer one sentence.
- Real values are good and make the image concrete: a header name, a CLI flag, a resource kind, a version.
- Warn the user to **check accents** on regeneration (`anotação`, `política`, `tráfego`, `versão` are where models slip) and to expect 2-3 regenerations per image.

## 5. Alt text (Portuguese)

Write it **after** the images land, describing what the finished infographic actually shows — its panels, labels and flow — not the metaphor you had in mind. Short, literal, standing on its own for a screen reader. Follow the convention in existing files under `src/data/articles/artigos/`.

## 6. Insert into the article

- Cover: `image: "https://stoblobcertificados011.blob.core.windows.net/imagens-blog/artigos/<ano>/<slug>/capa.png"` in the `Article` object (see `publishing-content` — this field gates whether OG/Twitter meta render at all).
- Inline: `![<alt text>](https://.../artigos/<ano>/<slug>/1.png)` (then `2.png`, `3.png`), each on its own line.
- Recent convention is `artigos/<ano>/<nome>/`; older articles use `artigos/<nome>/`. Match the year folder for anything new.
- The blob container is external to the repo, so the URL is written before the file exists. Tell the user explicitly which local file goes to which blob path.

## 7. Fallback: build the SVG instead

When the article is genuinely architectural, or the model keeps mangling a logo or a string, hand-write the SVG in this same style with the official marks embedded. Text renders correctly and the logos are the real ones. Offer this per-image, not as a replacement for the whole set.

## 8. Validate

```bash
node .claude/skills/publishing-content/scripts/check-article.mjs src/data/articles/artigos/your-file.ts
npm run typecheck
```

The checker warns on missing `image` but doesn't verify inline image count or that the blob URLs resolve — confirm that once the files are uploaded.
