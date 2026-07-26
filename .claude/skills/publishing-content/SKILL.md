---
name: publishing-content
description: Create or edit an article/blog post in src/data/articles/, following the Article data model, the site's supported markdown subset, and required SEO metadata. Use when adding a new .ts article file, editing article content or metadata, or when the user mentions publishing, an article, a blog post, og:image, or tags for a post.
---

# Publishing Content

Articles are plain TypeScript files, not a CMS. Each file exports `{ article: Article }` matching `src/data/articles/types.ts`. Drop technical articles in `src/data/articles/artigos/`, everything else (events, talks recaps, community posts) in `src/data/articles/blog-posts/`. `src/data/articles/index.ts` discovers new files automatically via `import.meta.glob` — no index to edit.

## Article shape

```ts
export const article: Article = {
  slug: "kebab-case-unique-slug",
  title: "...",
  excerpt: "...",           // used as meta description + RSS/sitemap summary
  content: `...markdown...`,
  date: "YYYY-MM-DD",        // also used for filename prefix and sort order
  category: "Artigos",       // or the event/community category used in blog-posts
  readTime: "5 min",
  image: "https://...",     // og:image — see below, most existing articles are missing this
  badges: [{ name, provider, image, link }],  // optional, e.g. certification badges
  tags: ["Extra Tag"],        // optional, on top of tags auto-derived from title/excerpt/category
  excludeTags: ["Azure"],    // optional, suppress a tag that would otherwise be auto-derived
};
```

File naming: `YYYY-MM-DD-slug.ts` (date must match the `date` field).

## Metadata that matters for discoverability

- **`image`**: without it, `use-article-meta-tags.ts` skips OG/Twitter meta tags entirely for that article (see the hook — it's gated on `article.image`). Most existing articles (77/86 at last check) don't set one; set it for anything meant to be shared on LinkedIn/Twitter.
- **Tags**: topic tags are auto-derived from `title` + `excerpt` + `category` by keyword rules in `src/lib/article-tags.ts` (`getArticleTags`). Only use `tags`/`excludeTags` to add a tag no keyword rule would catch, or to suppress a false-positive match — don't duplicate what the rules already infer.
- **`excerpt`**: also becomes the RSS item description and sitemap/OG description — write it as a complete sentence, not a title fragment.

## Markdown subset actually supported

`src/lib/markdown.ts` is a hand-written parser, not full CommonMark. Supported: fenced code blocks (with language, HTML-escaped), images (including a linked image `[![alt](img)](url)` pattern), links, GFM-style tables, headings `#`–`####`, bold/italic/bold-italic, inline code, and lists. Anything else (nested blockquotes, footnotes, task lists, HTML blocks) will pass through unrendered or render wrong — don't rely on it.

## Regenerating derived files

After adding/editing articles, or when metadata used by these must stay correct:

```bash
npm run rss:generate      # public/rss.xml — regex-parses slug/title/excerpt/date from article files
npm run sitemap:generate  # public/sitemap.xml + public/articles-meta.json
```

Both scripts extract fields with regexes like `/slug:\s*["']([^"']+)["']/` — keep those fields as simple single-line quoted string literals (not template literals, not multi-line) or the generators will silently miss the article.

## Validate before committing

```bash
node .claude/skills/publishing-content/scripts/check-article.mjs src/data/articles/artigos/your-file.ts
```

Checks required fields, slug/filename/date consistency, slug uniqueness across the whole `src/data/articles/` tree, and warns on missing `image`.
