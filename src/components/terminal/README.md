# Terminal component ports

These are hand-written `.astro` ports of the **PADD Terminal design system** components in
the Claude Design project `2164f014-2a4d-48fa-86c3-43a00d63c2fb`. Upstream they are React
`.jsx`, each paired with a `.d.ts` prop interface and a `.prompt.md`; here they are zero-JS
Astro components with scoped `<style>` blocks. `types.ts` names `_ds_bundle.js` as the
thing they were ported from.

There is **no build step, no codegen, and no pull mechanism** between the two sides — see
`.claude/standards/design-system-sync.md`. A port is correct only because someone read both
sides and made them agree. This file records when that last happened and what did not
match.

> **Scope decision (2026-08-11): this ledger is historical, not an active sync target.**
> Claude Design's component format is React by construction (`.jsx`/`.d.ts`, compiled to
> `_ds_bundle.js`) — an `.astro` file was never going to be droppable into it, so chasing
> 1:1 prop/DOM parity here means translating between two component models forever with no
> way to close the gap. Only the token layer (`../../styles/tokens/`, `design-system/`) is
> actively kept in sync going forward — see `.claude/standards/design-system-sync.md`'s
> scope note. The findings below are real and dated; re-verify a specific row only if
> there's a concrete reason to (e.g. deciding whether to backport one specific upstream
> feature), not as scheduled drift-prevention.

Tokens are the other half of the sync and are tracked separately:
`../../styles/tokens/README.md` (what is vendored) and `../../../design-system/README.md`
(the upstream etag/token journal).

> **DS side originally verified 2026-08-09 from a zip export; spot-checked live 2026-08-11.**
> Live `mcp__claude-design__*` access was granted via `/design-login` on 2026-08-11. A
> targeted re-check (not a full re-verification, per the scope decision above) fetched
> `SegmentBar.d.ts`, `Button.jsx`, `TerminalWindow.jsx`, and `StatusLine.jsx` live and
> confirmed every claim below that touches those four still holds — no upstream change
> since the zip. The other components (Pill, PromptLine, `Kicker`/`Heading`/`SectionHeader`
> — ported 2026-08-12 straight from the zip read, not re-fetched live — and the four
> still-unported ones) have not been re-checked live and are still only as fresh as the
> 2026-08-09 zip pass.

## The ports

The DS bundle has **13 components**, not 11 — the earlier guess ("2+ not identified") was
short by four. Nine names exist on both sides; four DS components have no local port; four
local components have no DS counterpart at all (confirmed, not assumed).

| DS source                                | Local port             | DS side              | Local side       | Findings                                                                                                                                                                                                                                               |
| ---------------------------------------- | ---------------------- | -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `primitives/Button.jsx`                  | `Button.tsx`           | read 2026-08-09      | ported 2026-08-13 | **near-verbatim `.tsx` port, RESOLVED** — [B1](#b1-button-and-pill-take-their-on-accent-colour-from-the-status-bar-confirmed-faithful), [F1](#f1-button-drops-disabled-and-arbitrary-style)'s resolution note                                            |
| `primitives/Pill.jsx`                    | `Pill.astro`           | read 2026-08-09      | read 2026-08-08  | **exact match**, all four tones — [B1](#b1-button-and-pill-take-their-on-accent-colour-from-the-status-bar-confirmed-faithful)                                                                                                                         |
| `console/SegmentBar.jsx`                 | `SegmentBar.tsx`       | read 2026-08-09      | ported 2026-08-13 | **near-verbatim `.tsx` port, RESOLVED** — [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need)'s resolution note                                                                                                     |
| `console/PromptLine.jsx`                 | `PromptLine.tsx`       | read 2026-08-09      | ported 2026-08-13 | **near-verbatim `.tsx` port, RESOLVED** — [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need)'s resolution note; literal padding is upstream's, not local — [C1](#c1-promptline-retypes-the-segment-padding-token-as-a-literal-inherited-from-upstream) |
| `console/StatusLine.jsx`                 | `StatusLine.tsx`       | read 2026-08-09      | ported 2026-08-12 | **near-verbatim `.tsx` port, RESOLVED** — [G2](#g2-statusline-dropped-the-context-escalation-ramp-and-the-modelcost-split)                                                                                                         |
| `console/TerminalWindow.jsx`             | `TerminalWindow.tsx`   | read 2026-08-09      | ported 2026-08-12 | **near-verbatim `.tsx` port, RESOLVED** — hairline carried over unchanged, [D1](#d1-terminalwindow-adds-a-hairline-the-source-does-not-have); `width` restored, `class`→`className` discovery — [F2](#f2-terminalwindow-drops-width)'s resolution note |
| ⛔ none — not in the 13-component bundle | `SegmentRule.astro`    | **confirmed absent** | read 2026-08-08  | local-only; untokenised geometry — [C3](#c3-segmentrule-is-entirely-untokenised)                                                                                                                                                                       |
| ⛔ none — not in the 13-component bundle | `PageBanner.astro`     | **confirmed absent** | read 2026-08-08  | local-only; literal type sizing — [C6](#c6-pagebanner-sizes-type-with-literals)                                                                                                                                                                        |
| ⛔ none — not in the 13-component bundle | `StreamItem.astro`     | **confirmed absent** | read 2026-08-08  | local-only; `52` duplicated — [C5](#c5-streamitems-icon-size-is-written-twice)                                                                                                                                                                         |
| ⛔ none — not in the 13-component bundle | `ThemeToggle.astro`    | **confirmed absent** | read 2026-08-08  | local-only; `data-mode` persistence is a site concern, no DS equivalent to have                                                                                                                                                                        |
| ⛔ none — not in the 13-component bundle | `FeaturedEntry.astro`  | **confirmed absent** | added 2026-08-09 | local-only; composes `Pill`/`Button`/`TerminalWindow`/`FormattedDate` around a `StreamEntry` for the first-entry treatment on the homepage and blog index                                                                                              |
| `typography/Kicker.jsx`                  | `Kicker.tsx`           | read 2026-08-09      | added 2026-08-12 | **near-verbatim `.tsx` port, new addition** — no local predecessor to diverge from (formerly inlined ad hoc as the `.kicker` span in `SectionDivider.astro`)                                                                                            |
| `typography/Heading.jsx`                 | `Heading.tsx`          | read 2026-08-09      | added 2026-08-12 | **near-verbatim `.tsx` port, new addition** — no local predecessor to diverge from (nearest analogue was `PageBanner.astro`'s unrelated `clamp()`-sized title)                                                                                          |
| `typography/SectionHeader.jsx`           | `SectionHeader.tsx`    | read 2026-08-09      | added 2026-08-12 | **near-verbatim `.tsx` port, new addition** — composes the real `Kicker.tsx`/`Heading.tsx`, closing out the "page/panel opener" trio — [F3](#f3-sectionheader-was-a-name-collision-now-resolved-by-renaming-the-local-component)                                            |
| `primitives/Panel.jsx`                   | _none_                 | read 2026-08-09      | —                | no local port — [H](#h-four-ds-components-with-no-local-port)                                                                                                                                                                                            |
| `primitives/Swatch.jsx`                  | _none_                 | read 2026-08-09      | —                | no local port — [H](#h-four-ds-components-with-no-local-port)                                                                                                                                                                                            |
| `console/CodeBlock.jsx`                  | _none_                 | read 2026-08-09      | —                | no local port — [H](#h-four-ds-components-with-no-local-port)                                                                                                                                                                                            |
| `spec/ConfigFile.jsx`                    | _none_                 | read 2026-08-09      | —                | no local port — [H](#h-four-ds-components-with-no-local-port)                                                                                                                                                                                            |

Nothing in `terminal/` is dead: 12 of the 15 local components are reachable from a real page,
and all 15 are rendered by `src/pages/_styleguide.astro`. `SegmentBar.tsx` is the only one
of those 12 with no external consumer, which is correct — it is the primitive `PromptLine`
and `StatusLine` compose. `Kicker.tsx`, `Heading.tsx`, and `SectionHeader.tsx` are the other
three: new as of 2026-08-12, and deliberately not wired into any real page yet — see the note
after
[F3](#f3-sectionheader-was-a-name-collision-now-resolved-by-renaming-the-local-component)
below.

## Props

Local prop surfaces, read from the files, now diffed against the upstream `.d.ts` for the
nine name-matched components.

| Component        | Local props                                                                                                                        | vs. DS `.d.ts`                                                                                                                                                                                                                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`         | **RESOLVED 2026-08-13** — `variant?: 'primary' \| 'secondary' \| 'ghost'` (default `primary`), `size?: 'sm' \| 'md'` (default `md`), `disabled?: boolean`, `href?`, `className?` (**not** `class` — Astro silently drops a literal `class="…"` written on a framework-component call site, so it never reaches the DOM and nothing errors), `children` | `disabled` restored, matching upstream's opacity/cursor/hover-suppression exactly — see [F1](#f1-button-drops-disabled-and-arbitrary-style)'s resolution note. `style?` stays dropped (re-affirmed, not a gap). `href` is a deliberate local addition upstream has no equivalent for (upstream is `onClick`-only). `onClick?` dropped — never used, and inert without a `client:*` directive this component intentionally has none of. Variant/size union and defaults still match exactly. |
| `Pill`           | `tone?: 'primary' \| 'secondary' \| 'tertiary' \| 'dim'` (default `secondary`), `class?`, slot                                     | Exact match; DS's `style?` has no Astro equivalent, not a gap.                                                                                                                                                                                                                                                                                       |
| `SegmentBar`     | **RESOLVED 2026-08-13** — `segments?: Segment[]` (default `[]`), `shape?: 'powerline' \| 'pill'` (default `'powerline'`), `style?`. Formerly `segments: Segment[]`, `inline?`, `gap?: string`, `class?` | Now matches DS `SegmentBarProps` exactly — see [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need)'s resolution note. |
| `PromptLine`     | **RESOLVED 2026-08-13** — `segments?: PromptSegment[]` (default a 4-cell demo line, `~/site` not upstream's `~/uss-cerritos`), `shape?: 'powerline' \| 'pill'` (default `'powerline'`), `style?`. Formerly `segments?: PromptSegment[]` only, no `shape`, no `style` | Now matches DS `PromptLineProps` exactly (`~/site` vs. `~/uss-cerritos` is a deliberate local branding choice, not a gap) — see [G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need)'s resolution note. `PromptKind` union (`path`/`git`/`ok`/`time`) matches exactly, and its asymmetric bookend `radius` values (`path` left-rounded, `ok` right-rounded, `git`/`time` square) are now restored from upstream's `KIND_STYLES` rather than the uniform `--radius-pill` the prior `.astro` stopgap forced. |
| `StatusLine`     | **RESOLVED 2026-08-12** — `lead?` (`'CLAUDE'`), `model?` (`'claude-opus-4.6'`), `cost?` (`'$0.42'`), `trail?` (`'92k / 200k'`), `level?: 'nominal'\|'steady'\|'warn'\|'critical'` (`'steady'`), `shape?: 'powerline'\|'pill'` (`'powerline'`), `style?`. Formerly `lead?` (`'~/site'`), `middle?: string[]`, `trail?` (`'deployed'`), `class?` | Now matches DS `StatusLineProps` exactly — see [G2](#g2-statusline-dropped-the-context-escalation-ramp-and-the-modelcost-split)'s resolution note.                                                                                                             |
| `TerminalWindow` | **RESOLVED 2026-08-12** — `title?` (default `'zsh'`), `width?: number \| string`, `style?`, `className?`. Formerly `title?`, `class?`, slot | Now matches DS `TerminalWindowProps` exactly, plus a local `className` — see [F2](#f2-terminalwindow-drops-width)'s resolution note. |
| `Kicker`         | **NEW 2026-08-12** — `children?`, `size?: 'sm' \| 'md' \| 'lg'` (default `'md'`), `color?` (default `var(--text-dim)`), `style?` | New port, no local predecessor to diverge from — matches DS `KickerProps` exactly. |
| `Heading`        | **NEW 2026-08-12** — `children?`, `level?: 1 \| 2` (default `1`), `color?` (default `var(--text-1)`), `style?` | New port, no local predecessor to diverge from — matches DS `HeadingProps` exactly. |
| `SectionHeader`  | **NEW 2026-08-12** — `kicker?: string`, `title?: string`, `meta?: string`, `small?: boolean`, `style?` | New port, no local predecessor to diverge from — matches DS `SectionHeaderProps` exactly; composes the real `Kicker`/`Heading` ports rather than reimplementing their rendering. |

`Tone` and `ButtonVariant` are declared in `types.ts`, which is this repo's
hand-written stand-in for the upstream `.d.ts` files. It was written from the bundle, not
generated, so it can drift without any signal — see
[H](#h-four-ds-components-with-no-local-port) for the four upstream `.d.ts` files `types.ts`
has no equivalent for at all. `PromptSegment` and `PromptKind` moved out to
`PromptLine.tsx` on 2026-08-13 (same precedent as `SegmentBar.tsx`'s own `Segment`) — they
were fully orphaned in `types.ts` once nothing else referenced them, confirmed by grep, so
they were deleted from `types.ts` rather than left as dead exports. `Segment` went the same
way on 2026-08-13: both consumers (`PromptLine.tsx` and `_styleguide.astro`) import it from
`SegmentBar.tsx`, whose definition is authoritative and omits the local-only `parts`/`border`
fields, so the `types.ts` copy was deleted too.

## Divergences

Grouped by the failure mode each represents. **B** and **D** entries below are now resolved
(confirmed faithful or confirmed deliberate) — kept for history so a re-sync doesn't
"re-fix" something that was never broken. **F**, **G**, and **H** are new, from the
2026-08-09 DS read.

### B. Token borrows across component families

#### B1. `Button` and `Pill` take their on-accent colour from the status bar — CONFIRMED FAITHFUL

`Button.astro:60` and `Pill.astro:29` both set `color: var(--status-lead-fg)` on their
`.primary` variant — the token that colours **`StatusLine`'s leading cell**. This was
flagged as an unverified cross-family borrow. **It is not local — `Button.jsx`'s `primary`
variant and `Pill.jsx`'s `primary` tone both write `color: 'var(--status-lead-fg)'`
upstream, verbatim.** The `--on-accent` alias the ledger expected instead is not referenced
by either DS component either.

Still worth knowing: `--status-lead-fg` and `--ink-on-accent` are identical in both shipped
amber scopes (`#2a1a0a` dark, `#fff7e8` light), so this is currently harmless either
way — but it's upstream's naming choice to carry forward, not a local rename hazard to fix.

#### B2. `Button.ghost`'s outline is not a border token — CONFIRMED FAITHFUL

`Button.astro:75` — `border: 1px solid var(--surface-chip)`. Upstream `Button.jsx` writes
the identical `border: '1px solid var(--surface-chip)'` for its `ghost` variant. `--surface-chip`
is a _fill_ token, not the `--border-1` hairline token every other bordered component uses
— but that inconsistency, and the light-mode contrast wobble it causes (documented below),
originates upstream. Nothing to fix locally; a fix here would itself be the divergence.

| Scope              | `--surface-chip` | `--border-1` | Ghost outline vs page                  |
| ------------------ | ---------------- | ------------ | -------------------------------------- |
| amber dark  | `#3d2d44`        | `#3d2d44`    | identical, 1.32:1                      |
| amber light | `#ead7bd`        | `#d8c3a8`    | **1.20:1 vs 1.46:1 — visibly fainter** |

Both values are sub-3:1 hairlines by design, so this stays a consistency footnote rather
than an accessibility failure. `_styleguide.astro` already carries a caveat noting it.

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

`SectionDivider.astro:25-26` — `gap: 14px`, `padding-bottom: 18px`. Neither is on the
spacing scale (which offers 12, 16, 20, 22). Since `SectionDivider.astro` was never a
port of anything upstream ([F3](#f3-sectionheader-was-a-name-collision-now-resolved-by-renaming-the-local-component)), there is
no DS value to compare these against either — same status as `SegmentRule`. Others in the
same category, also all local-only components: `PageBanner`'s `intro` sizing (`16px`/`1.8`,
see [C6](#c6-pagebanner-sizes-type-with-literals)), `StreamItem`'s `28px` gap and `30px` /
`24px` vertical padding.

`Button.astro:36` hard-codes `transition: filter 120ms ease`. Upstream `Button.jsx` has no
timing constant at all — the transition is a Astro-side substitute for the source's
React hover/press state ([D2](#d2-hover-and-press-are-css-not-react-state)), and the vendored
token set has no motion tokens to reference, upstream or local. Nothing to fix.

#### C5. `StreamItem`'s icon size is written twice

No DS source exists for this component (confirmed absent). `StreamItem.astro:34-35` passes
`width={52} height={52}` to `<Image>`, and CSS at `:98-99` separately sets `width: 52px; height: 52px`.
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

**Carried over unchanged 2026-08-12.** `TerminalWindow.astro` converted to `TerminalWindow.tsx`
(see [F2](#f2-terminalwindow-drops-width)'s resolution note) — the hairline border and its
explanatory comment moved into the new file's outer `style={{}}` object as-is. This was never
a gap to resolve, just a confirmed-deliberate divergence; noted here so a future reader
doesn't have to re-derive that it survived the conversion.

#### D2. Hover and press are CSS, not React state — CONFIRMED

`Button.astro:49,53` uses `:hover` / `:active` with `filter: brightness()`. Upstream
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

**RESOLVED 2026-08-13.** `Button.astro` converted to `Button.tsx`, a near-verbatim port of
`Button.jsx` (variants, `pad`/`fs` logic, and token values copied as-is — see
`design-system-sync.md`'s 2026-08-12 scope decision). `disabled?: boolean` is restored with
upstream's exact behaviour: 40% opacity, `not-allowed` cursor, hover/press suppressed. The
`<button>` case uses the native `disabled` attribute; `<a href>` has no native equivalent, so
it gets the standard accessible substitute instead — `aria-disabled="true"`, `tabindex="-1"`,
`pointer-events: none` — with the same hover/press suppression. `style?` stays dropped, same
verdict as before: the `class` prop is still the escape hatch (renamed `className` later the
same day — see the follow-up note below), and re-adding an arbitrary
`React.CSSProperties` passthrough isn't a fix, just reopening a closed call.

One mechanism decision, not a props change: upstream drives hover/press off real `useState` +
mouse-event handlers computing an inline `filter`. That's deliberately **not** replicated —
this stays pure CSS `:hover`/`:active` (now in a colocated `Button.module.css`, the first
component in this series needing a real pseudo-class rather than an inline `style={{}}`
object), so `Button` stays zero-JS with no `client:*` directive anywhere it's used. Same
rendered result (`brightness(1.1)` hover, `brightness(0.85)` press), different mechanism by
necessity — same precedent as [D2](#d2-hover-and-press-are-css-not-react-state).

`href` is documented in `Button.tsx`'s prop-interface doc comment as a deliberate local
addition, not a gap: upstream's `Button` has no link concept at all (`onClick`-only), but
every real call site (`Hero.astro` ×2, `FeaturedEntry.astro`) needs actual page navigation.
`onClick?: () => void` was dropped rather than ported — unused anywhere in `src/`, and since
this component intentionally stays non-hydrated, an accepted-but-inert `onClick` prop would be
a footgun, not a faithful port.

**Follow-up, 2026-08-13.** The `class` escape-hatch prop above was renamed to `className` —
`TerminalWindow.tsx`'s F2 resolution note (below) found that Astro silently drops a literal
`class="…"` written on a framework-component call site rather than forwarding it, so the prop
as originally named here would never have worked if a call site ever used it. No call site
does today (confirmed by grep), so this was a preventive rename, not a behavior change.
`SegmentBar.tsx`/`PromptLine.tsx` don't carry this risk — they dropped the `class` escape
hatch entirely rather than keeping a differently-broken version of it.

#### F2. `TerminalWindow` drops `width`

`TerminalWindowProps.width?: number | string` sets a fixed width upstream, letting a
`TerminalWindow` sit narrower than its container. `TerminalWindow.astro` has no equivalent
— every instance fills its container. Every current usage in `src/` happens to want full
width, so this is dormant rather than broken, but it's a real prop drop if a narrower
terminal card is ever needed.

**RESOLVED 2026-08-12.** `TerminalWindow.astro` converted to `TerminalWindow.tsx`, a
near-verbatim port of `TerminalWindow.jsx` (structure and token values copied as-is — see
`design-system-sync.md`'s 2026-08-12 scope decision). `width?: number | string` is restored,
matching upstream's type exactly (a plain `style` property, no unit coercion), and the
`_styleguide.astro` `TerminalWindow` spec gained a third demo pane (`width="320px"`) to show
it's now reachable.

`class`, the local addition, was **kept** rather than dropped — unlike the `class` drop that
never happened for `StatusLine`/`SegmentBar`/`PromptLine` (those genuinely had no call site
using it, confirmed by grep). Here `FeaturedEntry.astro:46` calls
`<TerminalWindow ... class="preview">`, and `FeaturedEntry.astro`'s own `:global(.preview)`
rule (its grid-order flip at the `< 720px` breakpoint) depends on being able to select into
`TerminalWindow`'s root element from outside. Dropping it the way the other three conversions
did would have silently broken that layout.

**But it had to be named `className`, not `class`.** Verified by instrumenting the component
with a temporary `console.error(Object.keys(props))` during `pnpm build` and reading the
actual props object a running `TerminalWindow` receives when called from
`FeaturedEntry.astro`: a literal `class="preview"` written on the Astro-template call site
**never arrives** — Astro's compiler silently drops it for non-Astro (framework) component
invocations rather than forwarding it as a `class` prop the way it does for `.astro`
components (confirmed both ways: an arbitrary `data-debug-test="hello"` attribute passed
through fine as a prop with that exact key, and swapping the call site to
`className="preview"` made the prop arrive under the key `className`). The rendered HTML
before this fix had **no `class` attribute on `TerminalWindow`'s root `<div>` at all** — a
build that looked clean (`astro check` and `pnpm build` both passed) while `FeaturedEntry`'s
mobile layout was silently broken. `TerminalWindow.tsx`'s local prop and `FeaturedEntry.astro`'s
call site both use `className`; confirmed fixed by re-running the same instrumented build and
checking the built HTML directly for `class="preview"` on the right element.

This is a real, general Astro behaviour, not specific to this component — **`Button.tsx`,
`SegmentBar.tsx`, and `PromptLine.tsx` all name their own escape hatch `class`, and would hit
the same silent drop if any `.astro` call site ever passed `class="…"` to them.** None
currently do (confirmed by grep at the time each was ported), so it's dormant there the same
way `width` was dormant here — but it's a latent bug waiting for the first real usage, not a
pattern to copy forward. If any of those three ever gain a real `class="…"` call site, rename
to `className` at that point rather than assuming the existing prop works.

**Superseded 2026-08-13 — none of those three still names its escape hatch `class`.** The
inventory in bold above, and the "rename at that point" advice that follows it, both describe
a state that no longer exists. Verified against the current source, not against this file's
own tables: `Button.tsx:36` declares `className?: string` (the preventive rename recorded in
[F1](#f1-button-drops-disabled-and-arbitrary-style)'s follow-up note above). `SegmentBar.tsx`
and `PromptLine.tsx` have no escape-hatch prop under either name — `SegmentBarProps` and
`PromptLineProps` are `segments?` / `shape?` / `style?` and nothing else, and neither file
contains the string `class` at all — so there is no prop there to rename and nothing to hit
the drop. The Astro behaviour this section documents is unchanged and is still the reason
`className` is the name to use; only the per-component inventory went stale.

#### F3. `SectionHeader` was a name collision, now resolved by renaming the local component

This was the biggest finding from the DS read. **`SectionHeader.astro` and
`SectionHeader.jsx` were two unrelated components that happened to share a name.**

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

Local `SectionHeader.astro` (as it was before the rename below):

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
[E1](#e1-the-spacing-scale-collision-is-live-in-terminal-but-only-bites-in-one-rule) — has to be
read as "local-only, no upstream reference exists," not "port pending verification."

What this actually means for the DS surface: **`SectionHeader.jsx`, `Kicker.jsx`, and
`Heading.jsx` — the whole "page/panel opener" trio — have no local port under any name.**
The nearest local analogue to what `SectionHeader.jsx` does is `PageBanner.astro` (large
Michroma title + intro paragraph, no kicker, no meta) and the ad hoc `.kicker` span inside
what is now `SectionDivider.astro`. If a page ever needs upstream's actual kicker+title+meta
opener, it doesn't exist yet and would need a genuine new port — see
[H](#h-four-ds-components-with-no-local-port).

**RESOLVED 2026-08-12.** The local component was renamed `SectionHeader.astro` →
`SectionDivider.astro` (all call sites — `index.astro`, `blog/index.astro`,
`projects/index.astro`, `_styleguide.astro` — updated to match; pure rename, no
behavioural, prop, or styling change). This settles the collision by removing it: the name
`SectionHeader` is no longer used by anything local, so it is genuinely free for a real
future port of upstream's actual `SectionHeader.jsx`. That future port — along with
`Kicker.jsx` and `Heading.jsx`, since all three make up the one "page/panel opener"
composition described above — remains unported and is tracked under
[H](#h-four-ds-components-with-no-local-port); nothing about this rename ports any of
that trio on its own — see the update notes below for what closed each one out. The main
port table above now lists `typography/SectionHeader.jsx` as a straightforward unported row
rather than a name-collision special case, since there is no longer a local file sharing its
name to collide with.

**Update, also 2026-08-12.** `Kicker.jsx` and `Heading.jsx` — two of the trio — are no
longer part of that "remains unported" claim: `Kicker.tsx` and `Heading.tsx` landed as
genuine new ports, near-verbatim, and are rendered in `_styleguide.astro`. Only
`SectionHeader.jsx` itself — the composition that reads `kicker`/`title`/`meta` and lays
the two out with a right-aligned aside — is still unported, tracked under
[H](#h-four-ds-components-with-no-local-port). Note this is scoped to existence, not
adoption: neither `Kicker` nor `Heading` has been wired into any real page — see the note
near the top of "The ports" section.

**Update, also 2026-08-12 (trio complete).** `SectionHeader.jsx` itself has now landed too,
as `SectionHeader.tsx` — a genuine new port that imports and composes the real `Kicker.tsx`
and `Heading.tsx` (not a reimplementation of either), exactly as upstream `SectionHeader.jsx`
composes `Kicker.jsx`/`Heading.jsx`. All three components the rename above cleared the name
for now exist locally, so the "page/panel opener" trio this section opened with is fully
ported. Same adoption caveat as the note above: `SectionHeader.tsx` is rendered in
`_styleguide.astro` but not wired into any real page — see the note near the top of
"The ports" section.

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

**RESOLVED 2026-08-13 (partial).** `SegmentBar.astro` converted to `SegmentBar.tsx`, a
near-verbatim port of `SegmentBar.jsx` (props, defaults, and both render branches copied
as-is — see `design-system-sync.md`'s 2026-08-12 decision reopening component parity).
`shape?: 'powerline' | 'pill'` now exists and matches upstream exactly, including the
pill-only forced `--radius-pill`/`clipPath: undefined`/`'4px 14px'` default padding and
the powerline-only `seg.radius`/`seg.clip`/`seg.overlap` handling described above. The
local-only `parts` field is gone from `SegmentBar`'s `Segment` type — `StatusLine.tsx`'s
powerline branch already demonstrates the faithful upstream alternative (a hand-composed
piped `<span>` inside one segment's `label`, not a bar-level feature). Point 2 above (the
`gap` mismatch — local `var(--space-2)` vs. upstream's hardcoded `var(--space-1)`) is also
resolved, as a side effect of `StatusLine.tsx` now composing the real `SegmentBar.tsx`
instead of its own inlined copy.

**Was "still open" as of the `SegmentBar` pass:** point 1 above was not yet resolved —
`PromptLine.astro` called the real `SegmentBar` with `shape="pill"` hardcoded, with no way
to pass `shape` through `PromptLine` itself to reach the powerline geometry `SegmentBar`
could already render.

**RESOLVED (fully) 2026-08-13.** `PromptLine.astro` converted to `PromptLine.tsx`, a
near-verbatim port of `PromptLine.jsx` (props, defaults, and `KIND_STYLES` copied as-is —
see `design-system-sync.md`'s 2026-08-12 scope decision). `shape?: 'powerline' | 'pill'`
now exists and matches upstream exactly, defaulting to `'powerline'` rather than the
`.astro` version's hardcoded pill. `KIND_STYLES`' `path`/`ok` radius values are restored to
upstream's asymmetric bookend rounding (`path` left-rounded, `ok` right-rounded, `git`/
`time` square) instead of the uniform `--radius-pill` the `.astro` stopgap forced on all
three — that uniform value only ever looked correct because every call site forced
`shape="pill"`, which ignores per-segment radius anyway. Every call site
(`Hero.astro`, `_styleguide.astro` ×3) now passes `shape="pill"` explicitly so the new
`'powerline'` default doesn't silently change what's already shipped. Point 1 of this
section is now fully closed — both `SegmentBar` and `PromptLine` have real `shape` props,
matching upstream.

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
   that. Upstream's amber values, for reference: dark `--ctx-nominal:#52e8d4`
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

**RESOLVED 2026-08-12.** `StatusLine.astro` converted to `StatusLine.tsx`, a near-verbatim
port of `StatusLine.jsx` (props, defaults, and both render branches copied as-is — see
`design-system-sync.md`'s 2026-08-12 scope decision). All five gaps above are closed:
`level` and the `--ctx-*` ramp exist (tokens added to `colors.css`'s `:root` and
`[data-mode="light"]` scopes only, see `tokens/README.md`), `model`/`cost` replace the local
`middle: string[]` invention, `shape` is a real prop with upstream's `'powerline'` default,
and the call sites (`Footer.astro`, `_styleguide.astro`) now pass `shape="pill"` explicitly
to preserve the prior look rather than that being a hidden component default.

**Update 2026-08-13:** `StatusLine.tsx` originally composed `SegmentBar`'s rendering via an
inlined, unexported private helper rather than importing a real `SegmentBar.tsx`, because
no `SegmentBar.tsx` port existed yet. That's now resolved — `SegmentBar.tsx` landed (see
[G1](#g1-segmentbar-dropped-the-shape-prop-that-statusline-and-promptline-both-need)'s
resolution note) and `StatusLine.tsx` imports and composes the real thing.

### H. Four DS components with no local port

Confirmed by reading the full 13-component bundle — not a guess. These have never been
ported under any name, so `types.ts` has no equivalent type for any of them either.

> **Count correction, 2026-08-12.** This section's heading previously read "Six," but the
> table below already listed seven rows — `typography/SectionHeader.jsx` was included here
> *and* separately counted as a "name collision, not a port" in the main port table above,
> so the two tables disagreed with each other about whether it was one of the "six" or not.
> Now that [F3](#f3-sectionheader-was-a-name-collision-now-resolved-by-renaming-the-local-component)
> is resolved (the local component renamed to `SectionDivider.astro`), there's no more
> ambiguity: `SectionHeader.jsx` is unambiguously unported, same as the other six, and the
> heading now said what the table actually showed at the time — seven.

> **Count correction, 2026-08-12 (second pass, same day).** `Kicker.jsx` and `Heading.jsx`
> were ported as `Kicker.tsx` and `Heading.tsx` — genuine new additions, not conversions of
> an existing local file (see the main port table above and
> [F3](#f3-sectionheader-was-a-name-collision-now-resolved-by-renaming-the-local-component)'s
> update note). That drops this section from seven rows to five; the heading and the table
> below are both updated to match.

> **Count correction, 2026-08-12 (third pass, same day).** `SectionHeader.jsx` itself has
> now landed as `SectionHeader.tsx` too — see [F3](#f3-sectionheader-was-a-name-collision-now-resolved-by-renaming-the-local-component)'s
> final update note. That drops this section from five rows to four; the row, the heading,
> and every `#h-four-ds-components-with-no-local-port` anchor referencing this section
> (there were several, all pointing at the old "five" slug) are updated to match.

| DS component                   | What it is                                                                                            | Nearest local thing (not a port of it)                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `primitives/Panel.jsx`         | Hairline-bordered card with the kicker/title/meta header baked in                                     | `TerminalWindow.tsx` is the only bordered container locally, and it's chrome-bar-shaped, not a generic panel       |
| `primitives/Swatch.jsx`        | Color chip: role label + hex caption, hairline border, `size` (default 128px)                         | None — the styleguide's color grids render swatches ad hoc, not through a shared component                           |
| `console/CodeBlock.jsx`        | Neutral code surface on the `--page-*` chrome ramp (theme-independent, reads the same in both themes) | None — no code-block component exists in `terminal/` at all                                                              |
| `spec/ConfigFile.jsx`          | Thin semantic wrapper over `CodeBlock` for real, copy-pasteable config files                          | None, for the same reason as `CodeBlock`                                                                             |

If any of these are wanted later, they're genuine new ports (read `.jsx` + `.d.ts` +
`.prompt.md`, write the Astro equivalent), not divergence fixes on an existing file.

### E. Token-rename exposure

`../../styles/tokens/README.md` logs three upstream renames. Their status **in `terminal/`
specifically**:

| Rename                                                          | Exposure here                                                                                                                                                                                                                                        |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--surface-raised` changed meaning (chip fill → tier-1 surface) | **Inert.** No `terminal/` component references it. Its only reference in `src/` is `global.css:32`, which feeds the `--color-raised` Tailwind utility — and no `bg-raised`/`text-raised` utility appears in any markup.                                  |
| `--space-2…11` index scale collided with `--space-1…8`          | **Live in `terminal/`.** Ten references sit in the ambiguous name band. Nine are fine; one is [E1](#e1-the-spacing-scale-collision-is-live-in-terminal-but-only-bites-in-one-rule), which turns out to be unresolvable for a different reason than expected. |
| `--text-display` went 26px → 40px                               | **Dead token, not a bug.** No `terminal/` component references it; its only reference in the repo is `src/pages/_styleguide.astro`. `PageBanner` sizes its own type instead, [C6](#c6-pagebanner-sizes-type-with-literals).                               |

#### E1. The spacing-scale collision is live in `terminal/`, but only bites in one rule

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

Nine of the ten `terminal/` references landing in that ambiguous band are gaps whose
value-named reading (2–4px) would be visibly broken against known-size neighbours — 2px
between 11px chrome dots, 4px between a 52px icon and its title — so those are correct as
written, under the canonical scale.

The tenth, `SectionDivider.astro:39` (`.rule { flex: 1; min-width: var(--space-6); }`, 32px
canonical vs. 6px value-named — the file was `SectionHeader.astro` at the time this was
written, renamed since, see [F3](#f3-sectionheader-was-a-name-collision-now-resolved-by-renaming-the-local-component)),
was flagged as _"resolve by reading the upstream `SectionHeader` `.jsx` and checking which
scale its `minWidth` was written against."_
**That plan doesn't work.** `SectionHeader.jsx` has been read now
([F3](#f3-sectionheader-was-a-name-collision-now-resolved-by-renaming-the-local-component)) — it has no `.rule` element, no
`min-width`, and nothing that stretches. The local `.rule` divider is a wholly local
invention with no upstream code path to check it against, under any scale. This is not
"pending DS access" any more; it's a local design judgment call (never show a rule stub
under 6px, or under 32px) that has to be made by looking at it in the browser at the
crowded-header breakpoint, not by reading a file.

The five unambiguous references (`--space-12` at `SegmentBar.astro:64` and
`StreamItem.astro:86`, plus `--space-24` and the rest outside `terminal/`) are safe — those names
exist under only one convention.

## Re-verifying a port

Manual, one component at a time. There is no automated pull — `design-system/README.md`
explains why. This is the **live-MCP procedure**, now usable — `/design-login` granted
access on 2026-08-11. The 2026-08-09 pass above used a one-off zip export because MCP
access wasn't granted yet; it got the structural diff done, but was a snapshot with no
etag. Prefer this procedure now, since it can be checked for freshness and the
`design-system/` journal (already capturing token etags) knows how to log it. Per the
scope decision at the top of this file, this is not something to run on a schedule —
only when there's a concrete reason to check a specific component.

**Read-only** — never call `write_files`, `copy_files`, or `delete_files` against the
design system project.

1. **Locate it.** `list_files(project_id: "2164f014-2a4d-48fa-86c3-43a00d63c2fb",
depth: -1)` returns the whole tree in one call — this is what `design-system/etags.json`
   already captures for the whole project, tokens included. The 2026-08-09 zip read
   already answered _which_ 13 components exist and which have no port — now 4
   ([H](#h-four-ds-components-with-no-local-port)) — this step is for catching anything
   added or removed since.
2. **Diff the props.** `read_file` the `.d.ts` and compare against the Props table and
   `types.ts` — names, optionality, union members, and defaults.
3. **Diff the styling.** `read_file` the `.jsx`. Upstream styles are inline `style={{}}`
   objects built from `var(--*)`, so a token reference reads across directly.
4. **Read the intent.** The `.prompt.md` carries the rationale the `.jsx` does not.
5. **Look at it.** `_styleguide.astro` has no route at all (underscore-excluded, per
   `design-system-sync.md`) — temporarily drop the `_` to view it locally with
   `pnpm dev`, then rename it back. All 15 render there in both `data-mode` values.
   Compare against `render_preview` on the DS side.
6. **Record the result.** Update the row's Verified date, and add anything that did not match
   to Divergences with a file:line. A row whose date is older than the last
   `design-system/etags.json` change to `_ds_bundle.js` should be treated as stale.

Do steps 1 and 2 for **all** components before step 3 for any of them. The listing and the
`.d.ts` files are cheap and catch the structural gaps; the `.jsx` diffs are slow and only
matter once you know the prop surface agrees.
