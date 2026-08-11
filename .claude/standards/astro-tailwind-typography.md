# Astro + Tailwind Typography

How long-form text is styled in this repo. Imported by `.claude/CLAUDE.md`.

## Setup

Tailwind v4, configured CSS-first — there is no `tailwind.config.js`. Everything is
declared in `src/styles/global.css`:

```css
@import "tailwindcss";
@import "./tokens/colors.css";
@import "./tokens/typography.css";
@import "./tokens/spacing.css";

@plugin "@tailwindcss/typography";
```

Tailwind is wired through `@tailwindcss/vite` in `astro.config.mjs`, not a PostCSS
config.

**Keep `@tailwindcss/typography` installed and declared even if nothing currently
applies a `prose` class.** It is treated as a ready state for upcoming styling work,
not as dead weight — don't remove it as "unused".

## Applying prose

Markdown-rendered bodies get both classes together:

```astro
<div class="prose prose-terminal">
  <Content />
</div>
```

`prose` brings the plugin's element rules; `prose-terminal` maps them onto this site's
design tokens. Neither works properly alone — never apply one without the other.

The three wrappers that render Markdown, and so carry this pairing:

- `src/layouts/BlogPost.astro`
- `src/layouts/Page.astro` (about, 404)
- `src/pages/projects/[...slug].astro`

A new Markdown-rendering route should use the same pair rather than inventing its own
body styles.

## The `prose-terminal` theme

Defined in `src/styles/global.css`. Three rules govern it:

**It is deliberately unlayered.** The plugin's own `.prose` rule is a single class, so
`prose-terminal` has to sit outside `@layer` to reliably win regardless of class order in
the markup. Don't move it into a layer to "tidy up" — that silently drops the
overrides.

**Colors come from tokens, never literals.** The theme sets `--tw-prose-*` variables to
`var(--text-1)`, `var(--accent)`, `var(--link)`, and friends, which is what keeps
article copy correct in both `data-mode` themes. A hard-coded hex in a prose rule is a
bug — it will break one of the two modes.

**Sizing is intentionally larger than the design system.** The UI runs 15px/1.7; prose
runs 16px/1.8 with `max-width: 68ch`. Mono is wide, and a long post needs more room
than a terminal pane does.

## Font constraints

Fonts are served through Astro's stable top-level `fonts` config (`astro.config.mjs`),
which exposes `--font-michroma` and `--font-jetbrains-mono`. Those are the names
`<Font cssVariable>` in `BaseHead.astro` must be given — `--font-display` and
`--font-mono` are aliases declared in the `@theme inline` block in
`src/styles/global.css`, and passing an alias to `<Font />` fails silently. Fonts are not
loaded via `@font-face` or a CDN link.

Michroma (the display face) ships a single weight, so any rule asking for bold headings
gets a synthesised, smeared face. `prose-terminal` therefore pins headings to
`font-weight: 400` and leans on `letter-spacing` for hierarchy instead. Preserve that
when adding heading rules.

The plugin also wraps inline `code` in literal backticks via `::before`/`::after`; the
token styling already marks code out, so both pseudo-elements are set to
`content: none`.

## Breakpoints

The one custom breakpoint is `--breakpoint-mobile: 720px`, which gives Tailwind's
`max-mobile:` variant. Tailwind compiles that to `@media not all and (width >= 720px)`.

Scoped component styles that need to flip at the same point must write
`@media (width < 720px)` — the exact equivalent. `@media (max-width: 720px)` is off by
one pixel and desyncs the component from the header, footer, and main shell at exactly
720px.
