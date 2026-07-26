---
name: design-system
description: Apply this site's design tokens, Tailwind config, and shadcn/ui component conventions when building or styling a component. Use when adding UI, changing colors/spacing/typography, adding a shadcn component, or touching src/index.css or tailwind.config.ts. For a broader design-quality/accessibility review pass, use the frontend-design-review skill instead.
---

# Design System

Tailwind v4 (`@import "tailwindcss"` + `@config` in `src/index.css`, not the v3 `@tailwind` directives) with `shadcn/ui` (Radix primitives) components under `src/components/ui/`. There is currently **one visual theme, not a light/dark toggle** — `:root` and `.dark` in `src/index.css` define the same HSL values, `darkMode: ["class"]` is configured in `tailwind.config.ts`, and `next-themes` is only imported inside `src/components/ui/sonner.tsx` (for toast theming), not wired up as a site-wide `ThemeProvider`. Don't assume a light mode exists to design for.

## Tokens (`src/index.css`)

All colors are HSL CSS custom properties, consumed via `hsl(var(--token))` — **always add new colors as HSL vars here**, referenced from `tailwind.config.ts` `theme.extend.colors`, never as raw hex/rgb in components.

- Core: `--background` (210 20% 6%, near-black), `--foreground` (220 15% 92%), `--primary`/`--accent` (180 100% 50%, cyan), `--card`, `--popover`, `--secondary`, `--muted`, `--destructive`, `--border`/`--input`/`--ring`.
- Extras: `--gradient-primary`, `--gradient-hero`, `--glow` (box-shadow value), `--transition-smooth`, `--radius` (0.75rem, drives `borderRadius.lg/md/sm` in Tailwind config).
- `sidebar-*` tokens exist in both CSS and Tailwind config but there's no sidebar component in `src/components/` currently using them — check before assuming they're live.

## Typography & motion (`tailwind.config.ts`)

- `fontFamily`: `sans` = Inter, `heading` = Poppins, `mono` = JetBrains Mono.
- Custom keyframes/animations: `accordion-down`/`accordion-up` (Radix accordion), `fade-in`, `fade-in-up`, `glow` (pulsing box-shadow) — reuse these via the `animate-*` utility classes instead of writing new `@keyframes`.
- `tailwindcss-animate` plugin is loaded — prefer its utilities for simple enter/exit transitions before hand-rolling keyframes.

## Components

`src/components/ui/` holds shadcn-generated primitives (`accordion`, `badge`, `button`, `card`, `dropdown-menu`, `separator`, `sonner`, `table`, `tabs`) built on `@radix-ui/react-*` + `class-variance-authority` (`cva`) for variants + `clsx`/`tailwind-merge` (`cn()` in `src/lib/utils.ts`) for class merging. Follow that pattern (`cva` for variants, `cn()` for conditional/merged classes) for any new UI primitive rather than introducing a different styling approach. `components.json` holds the shadcn CLI config if you need to add a new shadcn component (`npx shadcn add <name>`).

Page-level sections (`Hero`, `About`, `Experience`, `Talks`, etc.) live flat in `src/components/`, not `src/components/ui/` — that split is "primitive" vs "page section", keep new components on the correct side of it.

## Design review

For a structured review pass (accessibility, responsive behavior, visual polish, design-system compliance) rather than building new UI, use the `frontend-design-review` skill — it covers the review workflow this skill doesn't.
