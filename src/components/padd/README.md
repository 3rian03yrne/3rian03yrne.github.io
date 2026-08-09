# PADD component ports

These are hand-written `.astro` ports of the **PADD Terminal design system** components in
the Claude Design project `2164f014-2a4d-48fa-86c3-43a00d63c2fb`. Upstream they are React
`.jsx`, each paired with a `.d.ts` prop interface and a `.prompt.md`; here they are zero-JS
Astro components with scoped `<style>` blocks. `types.ts` names `_ds_bundle.js` as the
thing they were ported from.

There is **no build step, no codegen, and no pull mechanism** between the two sides — see
`.claude/standards/design-system-sync.md`. A port is correct only because someone read both
sides and made them agree. This file records when that last happened and what did not
match.

Tokens are the other half of the sync and are tracked separately:
`../../styles/tokens/README.md` (what is vendored) and `../../../design-system/README.md`
(the upstream etag/token journal).

> **DS-side columns are unverified as of 2026-08-08.** The `mcp__claude-design__*` tools
> refused every call with *"The user hasn't granted this — run `/design consent`"*, so the
> design system could not be read. Nothing upstream was opened; no `.jsx`, `.d.ts`, or
> `.prompt.md` was compared. Every claim below about DS behaviour is sourced from comments
> already written into this repo, and is marked as such. **The local half of every row was
> verified by reading the file.** Fill in the DS column by following
> [Re-verifying a port](#re-verifying-a-port) once access is granted.

## The ports

`DS source` is the upstream `.jsx` path. **No cell in that column has ever been filled**, so
read every one as *unknown*, never as *confirmed absent*.

| DS source | Local port | DS side | Local side | Local findings |
| --- | --- | --- | --- | --- |
| ⛔ never read | `Button.astro` | **UNVERIFIED** | read 2026-08-08 | **cross-family token borrow** — [B1](#b1-button-and-pill-take-their-on-accent-colour-from-the-status-bar), [B2](#b2-buttonghosts-outline-is-not-a-border-token) |
| ⛔ never read | `Pill.astro` | **UNVERIFIED** | read 2026-08-08 | same borrow as [B1](#b1-button-and-pill-take-their-on-accent-colour-from-the-status-bar) |
| ⛔ never read | `SegmentBar.astro` | **UNVERIFIED** | read 2026-08-08 | primitive — no direct consumers, only `PromptLine` and `StatusLine`. **`gap` prop is a 2026-08-08 local addition**, unverified against upstream — see [C2](#c2-statusline-switched-from-clipped-chevrons-to-gapped-pills) |
| ⛔ never read | `PromptLine.astro` | **UNVERIFIED** | read 2026-08-08 | **retypes `--pad-segment`'s value** — [C1](#c1-promptline-retypes-the-segment-padding-token-as-a-literal) |
| ⛔ never read | `StatusLine.astro` | **UNVERIFIED** | read 2026-08-08 | **rebuilt 2026-08-08 as gapped pills, not powerline chevrons** — [C2](#c2-statusline-switched-from-clipped-chevrons-to-gapped-pills) |
| ⛔ never read | `TerminalWindow.astro` | **UNVERIFIED** | read 2026-08-08 | **deliberate divergence** — adds a border absent upstream, [D1](#d1-terminalwindow-adds-a-hairline-the-source-does-not-have) |
| ⛔ never read | `SegmentRule.astro` | **UNVERIFIED** | read 2026-08-08 | **fully hard-coded geometry** — [C3](#c3-segmentrule-is-entirely-untokenised) |
| ⛔ never read | `SectionHeader.astro` | **UNVERIFIED** | read 2026-08-08 | off-scale literals [C4](#c4-off-scale-spacing-literals); the one ambiguous `--space-*` reference [E1](#e1-the-spacing-scale-collision-is-live-in-padd-but-only-bites-in-one-rule) |
| ⛔ never read | `PageBanner.astro` | **UNVERIFIED** | read 2026-08-08 | literal type sizing rather than tokens — [C6](#c6-pagebanner-sizes-type-with-literals) |
| ⛔ never read | `StreamItem.astro` | **UNVERIFIED** | read 2026-08-08 | only component needing a runtime (`astro:assets`, date formatting); **`52` duplicated** — [C5](#c5-streamitems-icon-size-is-written-twice) |
| ⛔ never read | `ThemeToggle.astro` | **UNVERIFIED** | read 2026-08-08 | may have no DS counterpart — `data-mode` persistence is a site concern. **Unconfirmed; do not assume.** |
| ⛔ **2+ DS components not identified** | *none* | **UNVERIFIED** | — | `design-system-sync.md` reports `_ds_bundle.js` carries **13** components against **11** ports. Names unknown; one `list_files` call settles it. |

Nothing in `padd/` is dead: every component is reachable from a page, and all 11 are
rendered by `src/pages/styleguide.astro`. `SegmentBar.astro` is the only one with no
external consumer, which is correct — it is the primitive `PromptLine` and `StatusLine`
compose.

### Local components with no DS source

Not ports. They are site-specific composition and should not be diffed upstream.

| Local | Role |
| --- | --- |
| `../Header.astro`, `../Footer.astro`, `../Hero.astro`, `../AboutBand.astro` | Site shell; compose `padd/` components |
| `../SocialLinks.astro`, `../HeaderLink.astro`, `../FormattedDate.astro`, `../BaseHead.astro` | Site plumbing |
| `../styleguide/Pane.astro`, `../styleguide/Spec.astro` | Preview scaffolding for `/styleguide` |

## Props

Local prop surfaces, read from the files. **The DS `.d.ts` column cannot be filled until
access is granted** — prop-level divergence is exactly what a `.d.ts` diff would catch, and
it is the single biggest gap in this document.

| Component | Local props |
| --- | --- |
| `Button` | `variant?: 'primary' \| 'secondary' \| 'ghost'` (default `primary`), `size?: 'sm' \| 'md'` (default `md`), `href?`, `class?`, slot |
| `Pill` | `tone?: 'primary' \| 'secondary' \| 'tertiary' \| 'dim'` (default `secondary`), `class?`, slot |
| `SegmentBar` | `segments: Segment[]`, `inline?` (default `false`), `gap?: string`, `class?` |
| `PromptLine` | `segments?: PromptSegment[]` (defaults to a 4-cell demo line), `class?` |
| `StatusLine` | `lead?` (`'~/site'`), `middle?: string[]` (`['⎇ main', 'astro']`, each rendered as its own pill), `trail?` (`'deployed'`), `class?` |
| `TerminalWindow` | `title?` (default `'zsh'`), `class?`, slot |
| `SegmentRule` | `class?` |
| `SectionHeader` | `label: string` (required), `class?`, slot (right-hand aside) |
| `PageBanner` | `title: string` (required), `intro?` |
| `StreamItem` | `entry: StreamEntry` (from `src/lib/stream.ts`) |
| `ThemeToggle` | `class?` |

`Segment`, `PromptSegment`, `Tone`, `ButtonVariant`, and `PromptKind` are declared in
`types.ts`, which is this repo's hand-written stand-in for the upstream `.d.ts` files. It
was written from the bundle, not generated, so it can drift without any signal.

Two prop-shaped things are worth checking first when access lands:

- **`Button` has `size`; nothing else does.** `Pill`, `ThemeToggle`, and the segment
  components each hard-code one size. If upstream exposes a size on any of them, the port
  silently dropped a prop.
- **`PromptKind` is a closed set of four** (`path`, `git`, `ok`, `time`) and `PromptLine`
  falls back to `time` for an unset `kind`. `types.ts` calls these *"the kinds of prompt
  cell the design system defines"* — an upstream fifth kind would not fail to compile, it
  would just render as dim text.

## Divergences

Verified by reading the local files. Grouped by the failure mode each represents.

### B. Token borrows across component families

#### B1. `Button` and `Pill` take their on-accent colour from the status bar

`Button.astro:55` and `Pill.astro:29` both set `color: var(--status-lead-fg)` on their
`.primary` variant — the token that colours **`StatusLine`'s leading cell**. The palette
defines `--on-accent` for exactly this job, and it is referenced by **nothing** in `src/`.

Currently harmless: `--status-lead-fg` and `--ink-on-accent` are identical in both shipped
cerritos-map scopes (`#2a1a0a` dark, `#fff7e8` light), so the rendering is correct. It is
recorded because it is a live rename hazard — the buttons and pills are coupled to a token
family they have nothing to do with, and `global.css` already re-tunes `--status-lead-bg`
for light mode without touching `--status-lead-fg`.

#### B2. `Button.ghost`'s outline is not a border token

`Button.astro:70` — `border: 1px solid var(--surface-chip)`. `--surface-chip` is a *fill*;
`--border-1` is the border token every other bordered component uses (`ThemeToggle`,
`TerminalWindow` via `--border-hairline`, `SectionHeader`'s rule).

This one **does** change rendering, in one scope only:

| Scope | `--surface-chip` | `--border-1` | Ghost outline vs page |
| --- | --- | --- | --- |
| cerritos-map dark | `#3d2d44` | `#3d2d44` | identical, 1.32:1 |
| cerritos-map light | `#ead7bd` | `#d8c3a8` | **1.20:1 vs 1.46:1 — visibly fainter** |

So the ghost button is the only bordered control whose outline weight moves between modes.
Both values are sub-3:1 hairlines by design, so this is a consistency defect rather than an
accessibility failure. `/styleguide` already carries a caveat noting it.

### C. Structural CSS re-implemented rather than derived

`design-system-sync.md` names `SegmentBar`'s chevron clip-path and `--pl-overlap: -10px` as
the example of this. **Reading the file, that is not quite right.** `SegmentBar.astro:68`
uses `var(--pl-overlap)`, and the slant polygons are tokenised (`--pl-slant-lead` /
`--pl-slant-trail` in `spacing.css`) — a caller passes them in as `clip`, `SegmentBar`
never hard-codes them. As of 2026-08-08 the only caller that ever did is gone:
`StatusLine.astro` switched to gapped pills, so in `src/` today the clip/overlap path is
exercised solely by the styleguide's standalone demo fixture, not by anything shipped —
[C2](#c2-statusline-switched-from-clipped-chevrons-to-gapped-pills).

#### C1. `PromptLine` retypes the segment-padding token as a literal

`PromptLine.astro:15,22` set `padding: '5px 16px'` for the `path` and `git` kinds.
`--pad-segment` is `5px 16px` (`spacing.css:7`), and `SegmentBar.astro:22` already falls
back to `var(--pad-segment)` when no padding is passed. Both kinds are re-specifying the
default with a copy of its value. Change `--pad-segment` upstream and these two cells stay
put while everything else moves.

The other two are genuinely different and correctly literal-ish: `ok` is `5px 14px`, `time`
is `5px 8px`.

#### C2. `StatusLine` switched from clipped chevrons to gapped pills

**2026-08-08, local decision, not a DS port.** `StatusLine.astro` no longer builds a
three-cell powerline (`clip: var(--pl-slant-*)`, `overlap: true`, hand-tuned asymmetric
padding to keep text clear of the slant). Each cell — `lead`, one per `middle[]` entry, and
`trail` — is now its own `radius: var(--radius-pill)` cell, separated by a new `gap` prop on
`SegmentBar` (`var(--space-2)`, 8px) instead of touching or overlapping. Padding is no
longer overridden per cell; it falls through to `SegmentBar`'s `--pad-segment` default.

What this means for the rest of the ledger:

- The old finding here — hand-copied literal paddings silently drifting from
  `--pl-slant-lead`/`--pl-slant-trail` if either token's cut percentage changed — no longer
  applies to `StatusLine`. `--pl-slant-lead`, `--pl-slant-trail`, and `--pl-overlap` are
  still defined in `spacing.css` and still work — `SegmentBar` didn't lose the clip/overlap
  path, only `StatusLine` stopped using it. The styleguide's standalone `powerlineSegments`
  fixture (`src/pages/styleguide.astro`) is what exercises that path now, for the primitive
  demo alone.
- `SegmentBar`'s `gap` prop is **local-only**: it exists to give `StatusLine` a shape (a row
  of separate pills, `radius: var(--radius-pill)`, non-clipped, non-overlapping) that isn't
  expressible with `clip`/`overlap` alone. Whether the DS source has an equivalent is
  unknown — nothing has read `SegmentBar.jsx` (see the UNVERIFIED note at the top of this
  file). Check for it first when access lands, before assuming this is a from-scratch local
  invention worth flagging as drift.
- `Segment.parts` (join several strings in one cell with a dimmed `|`) is untouched and
  still demoed directly on `SegmentBar` in the styleguide — `StatusLine` was its only
  consumer in `src/`, but it was never a `SegmentBar`-only-for-`StatusLine` feature, so it
  stays.
- **New `Segment.border` field**, also local-only. `--status-mid-bg` is defined equal to
  `--surface-panel` in every one of the four theme scopes (`colors.css`) — deliberately, so
  the old joined middle cell blended into the notch between the two chevrons. A detached
  pill sitting directly on that same panel colour has no visible edge without one — measured
  in the browser, `[data-theme="cerritos-map"][data-mode="light"]` renders the middle pill's
  background and the footer behind it as the literal same `rgb(238,221,198)`. `StatusLine`'s
  middle pills now set `border: 'var(--border-hairline)'` to compensate, the same reasoning
  `TerminalWindow` already used for its own same-colour-as-page body (`D1` below). The lead
  and trail pills don't need it — their backgrounds are the accent tokens, which are never
  equal to a surface token.

#### C3. `SegmentRule` is entirely untokenised

`SegmentRule.astro` uses tokens for its four colours and **literals for all geometry**:
`height: 3px`, then `flex: 0 0 180px / 64px / 26px`, dropping to `40% / 14% / 6%` below
720px. No spacing, size, or ratio token is involved. Of the eleven ports this is the one
where an upstream change propagates least.

#### C4. Off-scale spacing literals

`SectionHeader.astro:25-26` — `gap: 14px`, `padding-bottom: 18px`. Neither is on the
spacing scale (which offers 12, 16, 20, 22). Others in the same category: `Button` `8px
22px` / `5px 14px`, `Pill` `4px 14px`, `ThemeToggle` `5px 12px`, `TerminalWindow`'s `11px`
dots, `StreamItem`'s `28px` gap and `30px` / `24px` vertical padding.

`Button.astro:31` also hard-codes `transition: filter 120ms ease` — the vendored token set
has no motion tokens at all, so there is nothing to reference. Worth checking whether
upstream defines any.

#### C5. `StreamItem`'s icon size is written twice

`StreamItem.astro:26` passes `width={52} height={52}` to `<Image>`, and `:85-86` sets
`width: 52px; height: 52px` in CSS. The first controls what `astro:assets` generates, the
second what is displayed. Changing one alone either scales a mismatched asset or silently
halves the intrinsic resolution.

Same file, unrelated: `.when` (`:65`) uses `letter-spacing: 0.14em` while its sibling
`.meta` (`:117`) uses `var(--track-kicker-xs)` (`0.18em`) for the same uppercase-label role.
One of the two is wrong; which one is a DS question.

#### C6. `PageBanner` sizes type with literals

The component whose docstring calls it *"the oversized Michroma page title"* takes no type
size from the scale. `PageBanner.astro:26` uses `clamp(2rem, 1rem + 5vw, 4.5rem)` (topping
out at 72px) and `:28` a literal `letter-spacing: 0.01em`; the intro at `:35-36` is a literal
`16px` / `1.8` rather than `--text-body` (15px) / `--leading-body` (1.7), and `:34` caps it at
`60ch` where prose uses `68ch`.

The 16px/1.8 intro matches the prose sizing described in
`.claude/standards/astro-tailwind-typography.md` rather than the 15px/1.7 UI scale, so it
looks intentional — but it is written as literals in a component, not derived, so nothing
keeps the two in step. Related: `--text-display` (40px) exists and is referenced by no
shipped component; see the rename table above.

### D. Deliberate, recorded divergences

These are already commented in-file. Listed so a re-sync does not "fix" them.

#### D1. `TerminalWindow` adds a hairline the source does not have

`TerminalWindow.astro:26-29` — *"Not in the source component: its body sits on
`--surface-void`, the same colour as the page, so without a hairline the window has no edge
once it's out of the design doc's bordered card."* Keep it.

#### D2. Hover and press are CSS, not React state

`Button.astro:30` — *"The source component drove these off React hover/press state."* The
port uses `:hover` / `:active` with `filter: brightness()`. This is the structural
difference the whole port rests on and applies everywhere, not just `Button`; there is no
diff that can verify it.

### E. Token-rename exposure

`../../styles/tokens/README.md` logs three upstream renames. Their status **in `padd/`
specifically**:

| Rename | Exposure here |
| --- | --- |
| `--surface-raised` changed meaning (chip fill → tier-1 surface) | **Inert.** No `padd/` component references it. Its only reference in `src/` is `global.css:32`, which feeds the `--color-raised` Tailwind utility — and no `bg-raised`/`text-raised` utility appears in any markup. |
| `--space-2…11` index scale collided with `--space-1…8` | **Live in `padd/`.** Ten references sit in the ambiguous name band. Nine are almost certainly fine; one cannot be resolved without DS access. See [E1](#e1-the-spacing-scale-collision-is-live-in-padd-but-only-bites-in-one-rule). |
| `--text-display` went 26px → 40px | **Dead token, not a bug.** No `padd/` component references it; its only reference in the repo is `src/pages/styleguide.astro`. Recorded for completeness — nothing renders differently either way. `PageBanner` sizes its own type instead, [C6](#c6-pagebanner-sizes-type-with-literals). |

#### E1. The spacing-scale collision is live in `padd/`, but only bites in one rule

**The two scales use opposite naming conventions.** This is visible in `spacing.css` without
reading anything upstream:

| Convention | Tokens | Rule |
| --- | --- | --- |
| **Index-named** (canonical) | `--space-1:4px` `-2:8px` `-3:10px` `-4:16px` `-5:22px` `-6:32px` `-7:44px` `-8:64px` | name is a step number; name ≠ value |
| **Value-named** (console side) | `--space-12:12px` `-20:20px` `-24:24px` `-40:40px` `-48:48px` | **name is the pixel count**; name == value, in all five cases |

`spacing.css:4` labels the second group *"off-scale steps kept from the console side of the
merge"*. Note which ones survived: **every one is ≥ 12 — exactly the names the canonical
1…8 scale does not already own.** The console tokens in the 2…11 band were dropped because
their names were taken. That is the collision `design-system-sync.md` describes, and it
means any reference to `--space-2` … `--space-8` is ambiguous: under the surviving
convention `--space-6` reads as *6px*; today it resolves to *32px*.

Ten `padd/` references land in that ambiguous band. Rendering them both ways separates them
cleanly:

| Reference | Rule | Canonical (today) | If value-named | Reading |
| --- | --- | --- | --- | --- |
| `TerminalWindow.astro:35` | gap between the three 11px chrome dots | 8px | 2px | canonical — 2px dots would nearly touch |
| `SectionHeader.astro:48` | gap between aside pills | 8px | 2px | canonical |
| `StreamItem.astro:60` | gap, date → pill | 8px | 2px | canonical |
| `StreamItem.astro:112`, `:141` | gap between tag pills | 10px | 3px | canonical |
| `PageBanner.astro:20` | gap, `h1` → intro | 16px | 4px | canonical |
| `StreamItem.astro:80`, `:134` | gap, 52px icon → title | 16px | 4px | canonical |
| `SectionHeader.astro:39` | `min-width` of the flex-`1` rule | **32px** | **6px** | **cannot tell** |

Nine of the ten are gaps whose value-named reading (2–4px) would be visibly broken against
known-size neighbours — 2px between 11px dots, 4px between a 52px icon and its title. Those
were written against the canonical scale and are correct as they stand.

`SectionHeader.astro:39` is the one that resists. `.rule` is `flex: 1; height: 1px` with
`min-width: var(--space-6)`, so the min-width only engages when the label and aside crowd
the row — it sets the point at which the rule stops shrinking and the header wraps. Both
readings are coherent design intent: *"never show a rule stub under 6px"* and *"never show
one under 32px"* are each sensible, and neither looks wrong in isolation. Nothing in the
file, the token comments, or the render disambiguates them.

**Verdict: this is the known collision landing in a live rule, not an independent bug, and
it cannot be resolved locally.** It is a wrap-threshold difference, not a visual break — the
reason it has gone unnoticed. Resolve it by reading the upstream `SectionHeader` `.jsx` and
checking which scale its `minWidth` was written against; until then, leave it alone.

The five unambiguous references (`--space-12` at `SegmentBar.astro:62` and
`StreamItem.astro:73`, plus `--space-24` and the rest outside `padd/`) are safe — those names
exist under only one convention.

## Re-verifying a port

Manual, one component at a time. There is no automated pull —
`design-system/README.md` explains why.

**Prerequisite:** `/design consent`. Then, **read-only** — never call `write_files`,
`copy_files`, or `delete_files` against the design system project.

1. **Locate it.** `list_files(project_id: "2164f014-2a4d-48fa-86c3-43a00d63c2fb",
   depth: -1)` returns the whole tree in one call. Record the `.jsx` path in the table's DS
   column, and note the paired `.d.ts` and `.prompt.md`. This call also settles the open
   question above: which 2+ DS components have no port here.
2. **Diff the props.** `read_file` the `.d.ts` and compare against the Props table and
   `types.ts` — names, optionality, union members, and defaults. A prop present upstream and
   absent here is a dropped feature; a prop here and not upstream is a local invention worth
   a comment. Union members matter most: `ButtonVariant`, `Tone`, and `PromptKind` are all
   closed sets that fail soft.
3. **Diff the styling.** `read_file` the `.jsx`. Upstream styles are inline `style={{}}`
   objects built from `var(--*)`, so a token reference reads across directly. Check that
   every `var(--*)` upstream appears in the port's scoped `<style>`, and that every literal
   in the port matches the upstream literal. Section C is the list of literals to check.
4. **Read the intent.** The `.prompt.md` carries the rationale the `.jsx` does not. This is
   where a "this must stay in one row" or "this pads asymmetrically because of the chevron"
   constraint would be written down.
5. **Look at it.** `pnpm dev`, then `/styleguide` — all 11 render there in both `data-mode`
   values. Compare against `render_preview` on the DS side.
6. **Record the result.** Update the row's Verified date, and add anything that did not match
   to Divergences with a file:line. A row whose date is older than the last
   `design-system/etags.json` change to `_ds_bundle.js` should be treated as stale.

Do steps 1 and 2 for **all** components before step 3 for any of them. The listing and the
`.d.ts` files are cheap and catch the structural gaps; the `.jsx` diffs are slow and only
matter once you know the prop surface agrees.
