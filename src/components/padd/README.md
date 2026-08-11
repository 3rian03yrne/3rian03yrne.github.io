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

> **DS side verified 2026-08-09, from a zip export, not live MCP access.** The
> `mcp__claude-design__*` tools still refuse every call ("run `/design consent`"), so this
> is not the procedure below — the user supplied a downloaded zip of the same Claude Design
> project (`PADD Terminal Design System1.zip`, unpacked to a scratch dir) containing every
> `.jsx` / `.d.ts` / `.prompt.md` in the bundle. All 13 DS components were read directly and
> diffed against the local ports. **This settles the structural questions** (which DS
> components exist, which have a local port, prop-surface and inline-style diffs) but it is
> a **point-in-time snapshot with no etag**, so — unlike the MCP procedure below — there is
> no way to tell later whether upstream has since changed. Treat findings below as accurate
> as of the zip's contents, not as continuously fresh. Re-run
> [Re-verifying a port](#re-verifying-a-port) against live MCP once `/design consent` lands,
> to pick up anything that has moved since.

## The ports

The DS bundle has **13 components**, not 11 — the earlier guess ("2+ not identified") was
short by four. Seven names exist on both sides; six DS components have no local port; four
local components have no DS counterpart at all (confirmed, not assumed).

| DS source                                | Local port             | DS side              | Local side       | Findings                                                                                                                                                                                                                                               |
| ---------------------------------------- | ---------------------- | -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `primitives/Button.jsx`                  | `Button.astro`         | read 2026-08-09      | read 2026-08-08  | **faithful port**, two dropped props — [B1](#b1-button-and-pill-take-their-on-accent-colour-from-the-status-bar-confirmed-faithful), [F1](#f1-button-drops-disabled-and-arbitrary-style)                                                               |
| `primitives/Pill.jsx`                    | `Pill.astro`           | read 2026-08-09      | read 2026-08-08  | **exact match**, all four tones — [B1](#b1-button-and-pill-take-their-on-accent-colour-from-the-status-bar-confirmed-faithful)                                                                                                                         |
| `console/SegmentBar.jsx`                 | `SegmentBar.astro`     | read 2026-08-09      | read 2026-08-08  | **dropped the `shape` prop** — [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need)                                                                                                                                    |
| `console/PromptLine.jsx`                 | `PromptLine.astro`     | read 2026-08-09      | read 2026-08-08  | literal padding is upstream's, not local — [C1](#c1-promptline-retypes-the-segment-padding-token-as-a-literal-inherited-from-upstream); can't render pill shape — [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need) |
| `console/StatusLine.jsx`                 | `StatusLine.astro`     | read 2026-08-09      | read 2026-08-08  | **major divergence**, context-ramp feature missing entirely — [G2](#g2-statusline-dropped-the-context-escalation-ramp-and-the-modelcost-split)                                                                                                         |
| `console/TerminalWindow.jsx`             | `TerminalWindow.astro` | read 2026-08-09      | read 2026-08-08  | hairline confirmed deliberate — [D1](#d1-terminalwindow-adds-a-hairline-the-source-does-not-have); dropped `width` prop — [F2](#f2-terminalwindow-drops-width)                                                                                         |
| `typography/SectionHeader.jsx`           | `SectionHeader.astro`  | read 2026-08-09      | read 2026-08-08  | **name collision, not a port** — [F3](#f3-sectionheader-is-a-name-collision-not-a-port)                                                                                                                                                                |
| ⛔ none — not in the 13-component bundle | `SegmentRule.astro`    | **confirmed absent** | read 2026-08-08  | local-only; untokenised geometry — [C3](#c3-segmentrule-is-entirely-untokenised)                                                                                                                                                                       |
| ⛔ none — not in the 13-component bundle | `PageBanner.astro`     | **confirmed absent** | read 2026-08-08  | local-only; literal type sizing — [C6](#c6-pagebanner-sizes-type-with-literals)                                                                                                                                                                        |
| ⛔ none — not in the 13-component bundle | `StreamItem.astro`     | **confirmed absent** | read 2026-08-08  | local-only; `52` duplicated — [C5](#c5-streamitems-icon-size-is-written-twice)                                                                                                                                                                         |
| ⛔ none — not in the 13-component bundle | `ThemeToggle.astro`    | **confirmed absent** | read 2026-08-08  | local-only; `data-mode` persistence is a site concern, no DS equivalent to have                                                                                                                                                                        |
| ⛔ none — not in the 13-component bundle | `FeaturedEntry.astro`  | **confirmed absent** | added 2026-08-09 | local-only; composes `Pill`/`Button`/`TerminalWindow`/`FormattedDate` around a `StreamEntry` for the first-entry treatment on the homepage and blog index                                                                                              |
| `typography/Kicker.jsx`                  | _none_                 | read 2026-08-09      | —                | no local port — [H](#h-six-ds-components-with-no-local-port)                                                                                                                                                                                           |
| `typography/Heading.jsx`                 | _none_                 | read 2026-08-09      | —                | no local port — [H](#h-six-ds-components-with-no-local-port)                                                                                                                                                                                           |
| `primitives/Panel.jsx`                   | _none_                 | read 2026-08-09      | —                | no local port — [H](#h-six-ds-components-with-no-local-port)                                                                                                                                                                                           |
| `primitives/Swatch.jsx`                  | _none_                 | read 2026-08-09      | —                | no local port — [H](#h-six-ds-components-with-no-local-port)                                                                                                                                                                                           |
| `console/CodeBlock.jsx`                  | _none_                 | read 2026-08-09      | —                | no local port — [H](#h-six-ds-components-with-no-local-port)                                                                                                                                                                                           |
| `spec/ConfigFile.jsx`                    | _none_                 | read 2026-08-09      | —                | no local port — [H](#h-six-ds-components-with-no-local-port)                                                                                                                                                                                           |

Nothing in `padd/` is dead: every one of the 12 local components is reachable from a page,
and all 12 are rendered by `src/pages/styleguide.astro`. `SegmentBar.astro` is the only one
with no external consumer, which is correct — it is the primitive `PromptLine` and
`StatusLine` compose.

## Props

Local prop surfaces, read from the files, now diffed against the upstream `.d.ts` for the
seven name-matched components.

| Component        | Local props                                                                                                                        | vs. DS `.d.ts`                                                                                                                                                                                                                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`         | `variant?: 'primary' \| 'secondary' \| 'ghost'` (default `primary`), `size?: 'sm' \| 'md'` (default `md`), `href?`, `class?`, slot | DS also has `disabled?` and an arbitrary `style?`; both dropped — [F1](#f1-button-drops-disabled-and-arbitrary-style). Variant/size union and defaults match exactly.                                                                                                                                                                                |
| `Pill`           | `tone?: 'primary' \| 'secondary' \| 'tertiary' \| 'dim'` (default `secondary`), `class?`, slot                                     | Exact match; DS's `style?` has no Astro equivalent, not a gap.                                                                                                                                                                                                                                                                                       |
| `SegmentBar`     | `segments: Segment[]`, `inline?` (default `false`), `gap?: string`, `class?`                                                       | DS has `shape?: 'powerline' \| 'pill'` instead of `gap` — a different mechanism, not an additive prop. See [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need). DS's per-segment shape has no `parts` field — local-only, see [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need). |
| `PromptLine`     | `segments?: PromptSegment[]` (defaults to a 4-cell demo line), `class?`                                                            | DS also has `shape?: 'powerline' \| 'pill'`, passed straight through to `SegmentBar`. Dropped locally — [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need). `PromptKind` union (`path`/`git`/`ok`/`time`) matches exactly.                                                                                         |
| `StatusLine`     | `lead?` (`'~/site'`), `middle?: string[]` (each its own pill), `trail?` (`'deployed'`), `class?`                                   | DS shape is unrelated: `lead`, `model`, `cost`, `trail`, `level?: 'nominal'\|'steady'\|'warn'\|'critical'`, `shape?`. No `middle` array upstream — see [G2](#g2-statusline-dropped-the-context-escalation-ramp-and-the-modelcost-split).                                                                                                             |
| `TerminalWindow` | `title?` (default `'zsh'`), `class?`, slot                                                                                         | DS also has `width?: number \| string`. Dropped — [F2](#f2-terminalwindow-drops-width).                                                                                                                                                                                                                                                              |
| `SectionHeader`  | `label: string` (required), `class?`, slot (right-hand aside)                                                                      | DS's `SectionHeaderProps` is `kicker?`, `title?`, `meta?`, `small?` — no overlap at all. Not a props diff, a different component — [F3](#f3-sectionheader-is-a-name-collision-not-a-port).                                                                                                                                                           |

`Segment`, `PromptSegment`, `Tone`, `ButtonVariant`, and `PromptKind` are declared in
`types.ts`, which is this repo's hand-written stand-in for the upstream `.d.ts` files. It
was written from the bundle, not generated, so it can drift without any signal — see
[H](#h-six-ds-components-with-no-local-port) for the six upstream `.d.ts` files `types.ts`
has no equivalent for at all.

## Divergences

Grouped by the failure mode each represents. **B** and **D** entries below are now resolved
(confirmed faithful or confirmed deliberate) — kept for history so a re-sync doesn't
"re-fix" something that was never broken. **F**, **G**, and **H** are new, from the
2026-08-09 DS read.

### B. Token borrows across component families

#### B1. `Button` and `Pill` take their on-accent colour from the status bar — CONFIRMED FAITHFUL

`Button.astro:55` and `Pill.astro:29` both set `color: var(--status-lead-fg)` on their
`.primary` variant — the token that colours **`StatusLine`'s leading cell**. This was
flagged as an unverified cross-family borrow. **It is not local — `Button.jsx`'s `primary`
variant and `Pill.jsx`'s `primary` tone both write `color: 'var(--status-lead-fg)'`
upstream, verbatim.** The `--on-accent` alias the ledger expected instead is not referenced
by either DS component either.

Still worth knowing: `--status-lead-fg` and `--ink-on-accent` are identical in both shipped
cerritos-map scopes (`#2a1a0a` dark, `#fff7e8` light), so this is currently harmless either
way — but it's upstream's naming choice to carry forward, not a local rename hazard to fix.

#### B2. `Button.ghost`'s outline is not a border token — CONFIRMED FAITHFUL

`Button.astro:70` — `border: 1px solid var(--surface-chip)`. Upstream `Button.jsx` writes
the identical `border: '1px solid var(--surface-chip)'` for its `ghost` variant. `--surface-chip`
is a _fill_ token, not the `--border-1` hairline token every other bordered component uses
— but that inconsistency, and the light-mode contrast wobble it causes (documented below),
originates upstream. Nothing to fix locally; a fix here would itself be the divergence.

| Scope              | `--surface-chip` | `--border-1` | Ghost outline vs page                  |
| ------------------ | ---------------- | ------------ | -------------------------------------- |
| cerritos-map dark  | `#3d2d44`        | `#3d2d44`    | identical, 1.32:1                      |
| cerritos-map light | `#ead7bd`        | `#d8c3a8`    | **1.20:1 vs 1.46:1 — visibly fainter** |

Both values are sub-3:1 hairlines by design, so this stays a consistency footnote rather
than an accessibility failure. `/styleguide` already carries a caveat noting it.

### C. Structural CSS re-implemented rather than derived

`design-system-sync.md` names `SegmentBar`'s chevron clip-path and `--pl-overlap` as the
example of this. **Reading the file, that is not quite right.** `SegmentBar.astro:71`
(`.seg.overlap { margin-left: var(--pl-overlap); }`) and the slant polygons are tokenised
(`--pl-slant-lead` / `--pl-slant-trail` in `spacing.css`) — a caller passes them in as
`clip`, `SegmentBar` never hard-codes them. `StatusLine.astro` no longer passes them (it
switched to gapped pills — [G2](#g2-statusline-dropped-the-context-escalation-ramp-and-the-modelcost-split)),
so today the clip/overlap path is exercised only by the styleguide's standalone
`powerlineSegments` demo fixture, not by anything shipped.

#### C1. `PromptLine` retypes the segment-padding token as a literal — inherited from upstream

`PromptLine.astro:15,22` set `padding: '5px 16px'` for the `path` and `git` kinds.
`--pad-segment` is `5px 16px` (`spacing.css:7`), and `SegmentBar.astro:24` already falls
back to `var(--pad-segment)` when no padding is passed, so both kinds re-specify the
default as a copy of its value. **This is not a local mistake — `PromptLine.jsx` does the
exact same thing upstream**, hard-coding `padding: '5px 16px'` for both `path` and `git`
rather than referencing `--pad-segment`. It's still a live drift risk (change
`--pad-segment` and these two cells won't move), but it's a risk the port correctly
inherited rather than introduced.

`ok` (`5px 14px`) and `time` (`5px 8px`) are genuinely different values both upstream and
locally, and match exactly on both sides.

#### C3. `SegmentRule` is entirely untokenised

No DS source exists for this component (confirmed — not in the 13-component bundle).
`SegmentRule.astro` uses tokens for its four colours and **literals for all geometry**:
`height: 3px`, then `flex: 0 0 180px / 64px / 26px`, dropping to `40% / 14% / 6%` below
720px. No spacing, size, or ratio token is involved, and there is no upstream file to check
it against — this is purely a local design decision to keep sound or revisit on its own
terms.

#### C4. Off-scale spacing literals

`SectionHeader.astro:25-26` — `gap: 14px`, `padding-bottom: 18px`. Neither is on the
spacing scale (which offers 12, 16, 20, 22). Since `SectionHeader.astro` is not actually a
port of anything upstream ([F3](#f3-sectionheader-is-a-name-collision-not-a-port)), there is
no DS value to compare these against either — same status as `SegmentRule`. Others in the
same category, also all local-only components: `PageBanner`'s `intro` sizing (`16px`/`1.8`,
see [C6](#c6-pagebanner-sizes-type-with-literals)), `StreamItem`'s `28px` gap and `30px` /
`24px` vertical padding.

`Button.astro:31` hard-codes `transition: filter 120ms ease`. Upstream `Button.jsx` has no
timing constant at all — the transition is a Astro-side substitute for the source's
React hover/press state ([D2](#d2-hover-and-press-are-css-not-react-state)), and the vendored
token set has no motion tokens to reference, upstream or local. Nothing to fix.

#### C5. `StreamItem`'s icon size is written twice

No DS source exists for this component (confirmed absent). `StreamItem.astro:26` passes
`width={52} height={52}` to `<Image>`, and CSS separately sets `width: 52px; height: 52px`.
The first controls what `astro:assets` generates, the second what is displayed — changing
one alone either scales a mismatched asset or silently halves the intrinsic resolution.
Purely a local bug to fix on its own merits; no upstream reference applies.

#### C6. `PageBanner` sizes type with literals

No DS source exists for this component (confirmed absent — the DS component closest in
spirit, `typography/Heading.jsx`, is a plain two-size (40px/26px) Michroma title with no
`intro` paragraph at all, so it isn't a template to diff against either).
`PageBanner.astro:26` uses `clamp(2rem, 1rem + 5vw, 4.5rem)` (topping out at 72px, which
doesn't match either of `Heading`'s two DS sizes) and a literal `letter-spacing: 0.01em`;
the intro is literal `16px` / `1.8` rather than `--text-body` (15px) / `--leading-body`
(1.7), capped at `60ch` where prose uses `68ch`. The 16px/1.8 sizing matches
`.claude/standards/astro-tailwind-typography.md`'s prose scale, so it reads as intentional,
but nothing keeps it in step since it's written as literals. `--text-display` (40px) is
still unreferenced by any shipped component.

### D. Deliberate, recorded divergences

Already commented in-file, and now confirmed by reading the DS source directly.

#### D1. `TerminalWindow` adds a hairline the source does not have — CONFIRMED

`TerminalWindow.astro:29` adds `border: var(--border-hairline)`. **`TerminalWindow.jsx` has
no border at all** — its outer div sets `borderRadius`, `overflow`, `boxShadow`, and
`width` only. The in-file comment's reasoning (the body sits on `--surface-void`, the same
colour as the page, so the window needs an edge once it's outside the DS's bordered
card/panel context) holds. Keep it.

#### D2. Hover and press are CSS, not React state — CONFIRMED

`Button.astro:30` uses `:hover` / `:active` with `filter: brightness()`. Upstream
`Button.jsx` drives the identical values (`brightness(1.1)` hover, `brightness(0.85)`
press) off `onMouseEnter`/`onMouseDown` React state instead of CSS pseudo-classes. Same
rendered result, necessarily different mechanism in a JS-free Astro component. Applies
everywhere the DS uses inline React event handlers, not just `Button`.

### F. New from the 2026-08-09 DS read: dropped props and a name collision

#### F1. `Button` drops `disabled` and arbitrary `style`

`ButtonProps` upstream includes `disabled?: boolean` (fades to 40% opacity, sets
`cursor: not-allowed`) and a passthrough `style?: React.CSSProperties`. Neither exists on
`Button.astro` — there's no disabled state at all today. `style` has no clean Astro
equivalent (the `class` prop is the escape hatch instead), so that drop is fine; `disabled`
is a real, fixable gap if the site ever needs a disabled button.

#### F2. `TerminalWindow` drops `width`

`TerminalWindowProps.width?: number | string` sets a fixed width upstream, letting a
`TerminalWindow` sit narrower than its container. `TerminalWindow.astro` has no equivalent
— every instance fills its container. Every current usage in `src/` happens to want full
width, so this is dormant rather than broken, but it's a real prop drop if a narrower
terminal card is ever needed.

#### F3. `SectionHeader` is a name collision, not a port

This is the biggest finding from the DS read. **`SectionHeader.astro` and
`SectionHeader.jsx` are two unrelated components that happen to share a name.**

Upstream `typography/SectionHeader.jsx`:

```jsx
export function SectionHeader({ kicker, title, meta, small, style }) {
  return <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', ... }}>
    <div>{kicker && <Kicker .../>}{title && <Heading .../>}</div>
    {meta && <div>{meta}</div>}
  </div>;
}
```

Composes `Kicker` + `Heading` on the left and right-aligned telemetry (`meta`, e.g.
`"STARDATE 57436.2"`) on the right — it's the standard **page/panel opener**, per its own
`.prompt.md`: _"Opens every major section and every Panel."_

Local `SectionHeader.astro`:

```astro
<div class:list={["head", className]}>
  <span class="kicker">{label}</span>
  <span class="rule" aria-hidden="true"></span>
  <div class="aside"><slot /></div>
</div>
```

A `label` + a horizontal rule that stretches to whatever is slotted on the right (filter
pills, an "all entries" link) — a **list-section divider**, closer in role to a `<hr>` with
a caption than to a page title.

Neither `title` nor `meta` exists locally; neither the rule/slot layout nor its "run a line
out to the right" behaviour exists upstream. Every finding previously filed against this
component under the assumption it was an unverified port — [C4](#c4-off-scale-spacing-literals),
[E1](#e1-the-spacing-scale-collision-is-live-in-padd-but-only-bites-in-one-rule) — has to be
read as "local-only, no upstream reference exists," not "port pending verification."

What this actually means for the DS surface: **`SectionHeader.jsx`, `Kicker.jsx`, and
`Heading.jsx` — the whole "page/panel opener" trio — have no local port under any name.**
The nearest local analogue to what `SectionHeader.jsx` does is `PageBanner.astro` (large
Michroma title + intro paragraph, no kicker, no meta) and the ad hoc `.kicker` span inside
this same `SectionHeader.astro`. If a page ever needs upstream's actual kicker+title+meta
opener, it doesn't exist yet and would need a genuine new port — see
[H](#h-six-ds-components-with-no-local-port).

### G. New from the 2026-08-09 DS read: SegmentBar / PromptLine / StatusLine

#### G1. `SegmentBar` dropped the `shape` prop that `StatusLine` and `PromptLine` both need

Upstream `SegmentBar.jsx` takes `shape?: 'powerline' | 'pill'` (default `'powerline'`) and
branches its own rendering on it:

- **`pill`**: `gap: 'var(--space-1)'` (4px, **hardcoded, not configurable**) between cells;
  every segment forced to `borderRadius: 'var(--radius-pill)'`; `clipPath` forced
  `undefined` (ignores any `seg.clip`); default per-segment padding is `'4px 14px'`, not
  `--pad-segment`.
- **`powerline`**: `gap: 0`; segment radius falls back to `seg.radius ?? 0` (square unless
  given); `clipPath: seg.clip` is honoured; default padding is `var(--pad-segment)`.

`SegmentBar.astro` has none of this. It has a generic `gap?: string` prop instead — opt-in,
caller-supplied, with no radius/clip/padding behaviour bundled in. This has two concrete
consequences:

1. **`PromptLine.jsx` passes `shape` straight through, so upstream `PromptLine` can render
   as detached pills.** `PromptLine.astro` has no `shape` prop at all — it can only ever
   render the powerline geometry baked into `KIND_STYLES`. The pill variant of the shell
   prompt is a feature that exists upstream and not here.
2. **The `gap` value `StatusLine.astro` uses doesn't match upstream's pill gap.**
   `StatusLine.astro:46` passes `gap="var(--space-2)"` (8px). Upstream's `shape="pill"` path
   hardcodes `var(--space-1)` (4px) inside `SegmentBar` itself — not a prop, not
   overridable. Local and upstream pill-shaped statuslines are visibly different widths
   apart, and there's no version of the current API that could match upstream exactly
   without either hardcoding 4px in `SegmentBar` or changing the `gap` default.

Separately: **`Segment.parts`** (`types.ts:20`, "joined by a dimmed `|` within one cell") —
the earlier ledger entry treated this as unverified-but-probably-fine. **It does not exist
on DS's `Segment` interface at all.** Upstream gets the piped model|cost look in
`StatusLine.jsx` by hand-building a `<span>` with inline JSX children (a literal `|`
styled `color: 'var(--text-dim)'`) inside one segment's `label`, not through a generic
bar-level feature. `parts` is a genuine local generalization of that pattern — reasonable,
but a local invention, not a port of anything.

#### G2. `StatusLine` dropped the context-escalation ramp and the model/cost split

This is the largest single gap the DS read surfaced. Upstream `StatusLine.jsx`:

```jsx
export function StatusLine({
  lead = "CLAUDE",
  model = "claude-opus-4.6",
  cost = "$0.42",
  trail = "92k / 200k",
  level = "steady",
  shape = "powerline",
  style,
}) {
  if (shape === "pill") {
    return (
      <SegmentBar
        shape="pill"
        segments={[
          {
            label: lead,
            bg: "var(--status-lead-bg)",
            fg: "var(--status-lead-fg)",
            weight: 700,
            padding: "4px 14px",
          },
          { label: model, bg: "var(--surface-chip)", fg: "var(--text-1)" },
          { label: cost, bg: "var(--surface-chip)", fg: "var(--accent-3)" },
          {
            label: trail,
            bg: "var(--ctx-" + level + ")",
            fg: "var(--ink-on-ctx)",
            weight: 700,
          },
        ]}
      />
    );
  }
  /* powerline: slanted lead + a piped model|cost middle cell + a static-toned trail */
}
```

Five things `StatusLine.astro` does not have, all confirmed by reading `StatusLine.jsx` and
`StatusLine.d.ts` directly:

1. **No `level` prop, and no context-escalation ramp at all.** `readme.md`'s VISUAL
   FOUNDATIONS names this ramp as a first-class part of the system: _"a fixed
   context-escalation ramp `--ctx-nominal` cyan → `--ctx-steady` periwinkle → `--ctx-warn`
   amber → `--ctx-critical` coral… deliberately not theme-aliased… encodes rising heat."_
   **None of `--ctx-nominal`, `--ctx-steady`, `--ctx-warn`, `--ctx-critical`, or
   `--ink-on-ctx` exist anywhere in `src/styles/tokens/*.css` or anywhere else in `src/`** —
   confirmed by grep, not inference. This is the one thing in this whole ledger that reads
   as a dropped _feature_, not a dropped literal: a Claude Code statusline whose entire
   point is showing context usage has no connection to the token ramp built for exactly
   that. Upstream's cerritos-map values, for reference: dark `--ctx-nominal:#52e8d4`
   `--ctx-steady:#8fa3d6` `--ctx-warn` = `--amber` `--ctx-critical` = `--coral`
   `--ink-on-ctx:#0a0e14`; light `--ctx-nominal:#0e9d8c` `--ctx-steady:#5a71b0`
   `--ctx-warn:#b0782a` `--ctx-critical:#c4443a` `--ink-on-ctx:#f6f8fc`.
2. **No `model` / `cost` fields.** Upstream's middle content is always exactly two values
   (model name, cost), rendered together in one cell joined by a dimmed pipe. Local's
   `middle?: string[]` is an arbitrary-length array of independently-styled pills instead —
   a more general mechanism, but not what's on the `.d.ts`.
3. **No `shape` prop — the powerline geometry is unreachable through this component.**
   `StatusLine.astro` always renders the gapped-pill layout; there is no way to get the
   slanted-lead / piped-middle / slanted-trail powerline back via props, even though
   `SegmentBar` itself could still render it if asked (see [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need)).
4. **Powerline `trail` and pill `trail` mean different things upstream, and only the pill
   one is context-aware.** Even in upstream's own powerline mode, `trail`'s cell uses the
   static `--status-trail-bg` / `--status-trail-fg` pair, same as local. The `--ctx-*` ramp
   only ever drives the **pill** shape's trailing cell. So porting `level` support only
   needs to touch the pill path — the powerline path (currently unreachable anyway, see
   point 3) doesn't need it.
5. **Local's gap value doesn't match upstream's** — see [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need)
   point 2.

None of this contradicts the 2026-08-08 ledger entry that documented the powerline→pill
switch as "a local decision, not a DS port" — that part was correct. What's new is that
upstream _also_ has a pill shape, with its own (different) gap, its own (narrower) field
set, and a context-ramp feature the local version has no path to at all. If reconnecting
`StatusLine` to actual context usage is ever wanted, `level` + the five `--ctx-*` tokens are
the concrete, upstream-verified way to do it.

### H. Six DS components with no local port

Confirmed by reading the full 13-component bundle — not a guess. These have never been
ported under any name, so `types.ts` has no equivalent type for any of them either.

| DS component                   | What it is                                                                                            | Nearest local thing (not a port of it)                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `typography/Kicker.jsx`        | ALL-CAPS Michroma eyebrow, 3 sizes (`sm`/`md`/`lg` — 11px/0.18em, 11px/0.2em, 13px/0.25em)            | Inlined as the `.kicker` span in `SectionHeader.astro`, one size only, no `size` prop                                |
| `typography/Heading.jsx`       | Michroma title, 2 sizes only (`level 1` = 40px display, `level 2` = 26px panel title)                 | `PageBanner.astro`'s `clamp()`-sized `h1`, unrelated sizing — [F3](#f3-sectionheader-is-a-name-collision-not-a-port) |
| `typography/SectionHeader.jsx` | Kicker + Heading + right-aligned meta, the standard section/panel opener                              | Nothing — see [F3](#f3-sectionheader-is-a-name-collision-not-a-port)                                                 |
| `primitives/Panel.jsx`         | Hairline-bordered card with the kicker/title/meta header baked in                                     | `TerminalWindow.astro` is the only bordered container locally, and it's chrome-bar-shaped, not a generic panel       |
| `primitives/Swatch.jsx`        | Color chip: role label + hex caption, hairline border, `size` (default 128px)                         | None — the styleguide's color grids render swatches ad hoc, not through a shared component                           |
| `console/CodeBlock.jsx`        | Neutral code surface on the `--page-*` chrome ramp (theme-independent, reads the same in both themes) | None — no code-block component exists in `padd/` at all                                                              |
| `spec/ConfigFile.jsx`          | Thin semantic wrapper over `CodeBlock` for real, copy-pasteable config files                          | None, for the same reason as `CodeBlock`                                                                             |

If any of these are wanted later, they're genuine new ports (read `.jsx` + `.d.ts` +
`.prompt.md`, write the Astro equivalent), not divergence fixes on an existing file.

### E. Token-rename exposure

`../../styles/tokens/README.md` logs three upstream renames. Their status **in `padd/`
specifically**:

| Rename                                                          | Exposure here                                                                                                                                                                                                                                        |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--surface-raised` changed meaning (chip fill → tier-1 surface) | **Inert.** No `padd/` component references it. Its only reference in `src/` is `global.css:32`, which feeds the `--color-raised` Tailwind utility — and no `bg-raised`/`text-raised` utility appears in any markup.                                  |
| `--space-2…11` index scale collided with `--space-1…8`          | **Live in `padd/`.** Ten references sit in the ambiguous name band. Nine are fine; one is [E1](#e1-the-spacing-scale-collision-is-live-in-padd-but-only-bites-in-one-rule), which turns out to be unresolvable for a different reason than expected. |
| `--text-display` went 26px → 40px                               | **Dead token, not a bug.** No `padd/` component references it; its only reference in the repo is `src/pages/styleguide.astro`. `PageBanner` sizes its own type instead, [C6](#c6-pagebanner-sizes-type-with-literals).                               |

#### E1. The spacing-scale collision is live in `padd/`, but only bites in one rule

**The two scales use opposite naming conventions.** This is visible in `spacing.css` without
reading anything upstream:

| Convention                     | Tokens                                                                               | Rule                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| **Index-named** (canonical)    | `--space-1:4px` `-2:8px` `-3:10px` `-4:16px` `-5:22px` `-6:32px` `-7:44px` `-8:64px` | name is a step number; name ≠ value                           |
| **Value-named** (console side) | `--space-12:12px` `-20:20px` `-24:24px` `-40:40px` `-48:48px`                        | **name is the pixel count**; name == value, in all five cases |

`spacing.css:4` labels the second group _"off-scale steps kept from the console side of the
merge"_. Note which ones survived: **every one is ≥ 12 — exactly the names the canonical
1…8 scale does not already own.** The console tokens in the 2…11 band were dropped because
their names were taken. That is the collision `design-system-sync.md` describes, and it
means any reference to `--space-2` … `--space-8` is ambiguous: under the surviving
convention `--space-6` reads as _6px_; today it resolves to _32px_.

Nine of the ten `padd/` references landing in that ambiguous band are gaps whose
value-named reading (2–4px) would be visibly broken against known-size neighbours — 2px
between 11px chrome dots, 4px between a 52px icon and its title — so those are correct as
written, under the canonical scale.

The tenth, `SectionHeader.astro:39` (`.rule { flex: 1; min-width: var(--space-6); }`, 32px
canonical vs. 6px value-named), was flagged as _"resolve by reading the upstream
`SectionHeader` `.jsx` and checking which scale its `minWidth` was written against."_
**That plan doesn't work.** `SectionHeader.jsx` has been read now
([F3](#f3-sectionheader-is-a-name-collision-not-a-port)) — it has no `.rule` element, no
`min-width`, and nothing that stretches. The local `.rule` divider is a wholly local
invention with no upstream code path to check it against, under any scale. This is not
"pending DS access" any more; it's a local design judgment call (never show a rule stub
under 6px, or under 32px) that has to be made by looking at it in the browser at the
crowded-header breakpoint, not by reading a file.

The five unambiguous references (`--space-12` at `SegmentBar.astro:65` and
`StreamItem.astro:73`, plus `--space-24` and the rest outside `padd/`) are safe — those names
exist under only one convention.

## Re-verifying a port

Manual, one component at a time. There is no automated pull — `design-system/README.md`
explains why. This is the **live-MCP procedure**; the 2026-08-09 pass above used a
one-off zip export instead (see the banner at the top) because MCP access is still
ungranted. The zip got the structural diff done, but it's a snapshot with no etag — prefer
this procedure once `/design consent` lands, since it can be checked for freshness and the
`design-system/` journal knows how to log it.

**Prerequisite:** `/design consent`. Then, **read-only** — never call `write_files`,
`copy_files`, or `delete_files` against the design system project.

1. **Locate it.** `list_files(project_id: "2164f014-2a4d-48fa-86c3-43a00d63c2fb",
depth: -1)` returns the whole tree in one call. The 2026-08-09 zip read already answered
   _which_ 13 components exist and which 6 have no port ([H](#h-six-ds-components-with-no-local-port))
   — this step is for catching anything added or removed since, and for the `etags.json`
   baseline `design-system/README.md` still needs.
2. **Diff the props.** `read_file` the `.d.ts` and compare against the Props table and
   `types.ts` — names, optionality, union members, and defaults.
3. **Diff the styling.** `read_file` the `.jsx`. Upstream styles are inline `style={{}}`
   objects built from `var(--*)`, so a token reference reads across directly.
4. **Read the intent.** The `.prompt.md` carries the rationale the `.jsx` does not.
5. **Look at it.** `pnpm dev`, then `/styleguide` — all 12 render there in both `data-mode`
   values. Compare against `render_preview` on the DS side.
6. **Record the result.** Update the row's Verified date, and add anything that did not match
   to Divergences with a file:line. A row whose date is older than the last
   `design-system/etags.json` change to `_ds_bundle.js` should be treated as stale.

Do steps 1 and 2 for **all** components before step 3 for any of them. The listing and the
`.d.ts` files are cheap and catch the structural gaps; the `.jsx` diffs are slow and only
matter once you know the prop surface agrees.
