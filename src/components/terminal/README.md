# Terminal components

The site's visual language: console chrome, segment bars, shell-prompt geometry, Michroma
titles. These started as hand-ports of the PADD Terminal Design System built in Claude Design
— see `.claude/standards/design-system-origins.md` — but this directory is the source of
truth now. There is nothing upstream to reconcile against.

## Shape of the directory

Every component here is presentational: props in, markup out, no state, no data fetching.

- **`.tsx` components** (`Button`, `Heading`, `Kicker`, `PromptLine`, `SectionHeader`,
  `SegmentBar`, `StatusLine`, `TerminalWindow`) style themselves with inline `style={{}}`
  objects full of `var(--*)` references — the shape they were ported in. None of them holds
  client-side state, so none is rendered with a `client:*` directive: Astro renders them to
  static HTML at build time and ships **zero JavaScript**. Adding a hydration directive
  should be a deliberate decision about a specific interactive behaviour, not a default.
- **`.astro` components** (`AutomationIcon`, `FeaturedEntry`, `PageBanner`, `Pill`,
  `SectionDivider`, `SegmentRule`, `StreamItem`, `ThemeToggle`) use scoped `<style>` blocks.
  `ThemeToggle` is the only one with a script.
- **`index.ts`** is the directory's public API. Import from `terminal/`, not from individual
  files.
- **`types.ts`** holds only the types shared across components (`Tone`, `ButtonVariant`).
  Per-component types live with their component — `Segment` in `SegmentBar.tsx`,
  `PromptSegment`/`PromptKind` in `PromptLine.tsx`.

Every colour comes from the CSS custom properties in `src/styles/tokens/` — a literal hex in
one of these components is a bug, since it will be wrong in one of the two modes. Geometry is
less strict: several components write paddings and sizes as literals, noted below where it
matters. `src/pages/styleguide.astro` renders all of them in both `data-mode` values at
`/styleguide`.

## `className`, never `class`, on the `.tsx` components

Astro's compiler **silently drops a literal `class="…"` written on a framework-component
invocation**. It does not forward it as a prop, it does not error, and the build stays green
— the attribute simply never reaches the DOM. (An arbitrary attribute like
`data-debug-test="hello"` passes through fine; `class` specifically does not. Both directions
were confirmed by logging the actual props object a component receives during a build.)

So a `.tsx` component that needs a styling escape hatch names it `className`, and the
`.astro` call site writes `className="…"`. `TerminalWindow` is the case that surfaced this:
`FeaturedEntry.astro` selects into its root element with `:global(.preview)` for the grid
flip at the mobile breakpoint, and that layout was silently broken until the prop was
renamed. `Button` carries the same prop under the same name; the others take no class at all.

This does not apply to the `.astro` components, which take `class` normally.

## Per-component notes

Only the things that aren't obvious from reading the file.

**`SegmentBar`** — the primitive `PromptLine` and `StatusLine` both compose. One segment
model, two geometries: `powerline` butts blocks together (zero gap, per-segment `radius` and
`clip` honoured, `overlap` pulls a segment left by `--pl-overlap` so a slanted cap tucks
under its neighbour), `pill` detaches them into capsules (`--space-1` gap, `--radius-pill`
and a `4px 14px` default padding forced, `clip` ignored). The slant shapes themselves are
tokens (`--pl-slant-lead` / `--pl-slant-trail`) passed in by the caller; `SegmentBar` never
hard-codes geometry.

**`PromptLine`** — a shell prompt: `KIND_STYLES` maps each `PromptKind` onto a `Segment`, and
the bar does the rest. The `path`/`ok` kinds carry asymmetric bookend radii (left-rounded,
right-rounded) with `git`/`time` square, which only shows in `powerline`; `pill` overrides
every radius anyway. Note that `path` and `git` write their padding as the literal
`5px 16px` rather than `var(--pad-segment)`, which happens to be the same value — change the
token and these two cells won't move with it.

**`StatusLine`** — a Claude Code statusline, also over `SegmentBar`. In `pill` shape the
trailing cell is context-aware: `level` selects from the `--ctx-nominal` → `--ctx-steady` →
`--ctx-warn` → `--ctx-critical` ramp in `tokens/colors.css`, which is deliberately not
theme-aliased (fixed hues that encode rising context usage, not the active palette). The
`powerline` shape does not use the ramp — its trail is the static `--status-trail-*` pair —
and its middle cell hand-composes `model | cost` into one segment's label with a dimmed pipe.

**`Button`** — `href` is a local addition: with it the component renders an `<a>`, without it
a `<button>`. Every real call site (`Hero.astro`, `FeaturedEntry.astro`) needs actual page
navigation, and there is no `onClick` prop precisely because this component is never
hydrated — accepting a handler that could never fire would be a footgun.

Hover and press are CSS `:hover`/`:active` in `Button.module.css`, not React state. That is
what keeps the component zero-JS. It is the only component here needing a real pseudo-class
rather than an inline style object, hence the one stylesheet in the directory. `disabled` on
the `<button>` path is the native attribute; on the `<a>` path it is the standard accessible
substitute (`aria-disabled`, `tabindex="-1"`, `pointer-events: none`).

The `ghost` variant outlines itself with `--surface-chip`, a fill token, rather than the
`--border-1` hairline every other bordered component uses. In amber dark the two hold the
same value, so it makes no difference; in amber light `--surface-chip` is the lighter of the
two and ghost's outline is visibly fainter. Both are sub-3:1 hairlines by design, so this is
a consistency wrinkle rather than an accessibility failure — the styleguide entry carries a
caveat noting it.

**`TerminalWindow`** — the `border: var(--border-hairline)` on the outer element is a local
addition. The window body sits on `--surface-void`, the same colour as the page, so without
a hairline it has no edge at all outside a bordered container. `width` is optional; omitted,
it fills its container, which is what every current call site wants.

**`SectionHeader` vs `SectionDivider`** — two unrelated components with confusingly close
names. `SectionHeader.tsx` is the page opener: kicker + heading on the left, right-aligned
meta on the right, composing the real `Kicker` and `Heading` rather than reimplementing them
(`Page.astro` uses it). `SectionDivider.astro` is a list-section divider — a label with a
rule running out to whatever is slotted on the right — closer to a captioned `<hr>`. It was
originally named `SectionHeader.astro`; it got renamed to free the name, not because anything
about it changed.

**`StreamItem`** — the icon size `52` is written twice, once as `width`/`height` props on
`<Image>` (which controls what `astro:assets` generates) and once in CSS (which controls what
is displayed). Changing one alone either scales a mismatched asset or halves the intrinsic
resolution.

**`SegmentRule`, `PageBanner`, `StreamItem`, `SectionDivider`, `ThemeToggle`,
`FeaturedEntry`, `AutomationIcon`** are local inventions with no design-system ancestor.
Several write geometry as literals off the spacing scale — `SegmentRule`'s flex runs,
`PageBanner`'s `clamp()` title and `16px`/`1.8` intro, `SectionDivider`'s `14px` gap and
`18px` padding. Those are judgment calls to keep or revisit on their own terms.
