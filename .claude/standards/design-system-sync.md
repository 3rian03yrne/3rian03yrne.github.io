# Design system sync

How this repo stays honest about its relationship to the **PADD Terminal Design
System** in Claude Design (project `2164f014-2a4d-48fa-86c3-43a00d63c2fb`) — the
source the `src/components/terminal/` ports and `src/styles/tokens/*.css` are hand-derived
from.

This file is the overview and the rationale. It does not carry current findings —
those live in, and should be updated in, two ledgers:

- **`src/components/terminal/README.md`** — component-level. Which upstream components have
  a local port, prop-surface diffs, styling divergences, verified-as-of dates.
- **`design-system/README.md`** — token-level. The etag/manifest journal used to detect
  upstream changes (including silent renames) before they cause damage.

If you're here to re-verify a port or refresh the token snapshot, go to those files —
they carry the actual procedure and the current state. Come back here only for *why*
the process looks the way it does.

## Scope decision (2026-08-11): tokens only, not component parity

Claude Design's component format — `components/**/*.jsx` + `.d.ts` + `.prompt.md`,
compiled into `_ds_bundle.js` — is React by construction, not a choice this project made.
An `.astro` file cannot be dropped into that canvas; it isn't a runtime component model
Claude Design can render or take props against. Chasing 1:1 prop/DOM parity between the
two sides (what `terminal/README.md`'s component ledger was built to track) means
hand-translating between two component models forever, in both directions, with no way to
close the gap for good.

**Decision: only the token layer (`design-system/` + `src/styles/tokens/`) is an actively
maintained sync target going forward.** Tokens are plain CSS custom properties — the one
artifact that's genuinely framework-agnostic and cheap to keep faithful. Component-level
parity tracking in `terminal/README.md` is kept as a historical record (it's real research,
not wrong), but is no longer something to actively chase or re-verify on a schedule.
Claude Design's actual documented plan (`readme.md` in the DS project itself) was always to
extend into "a component system for a portfolio, blog, resume, personal site" — i.e. to
support new design exploration, not to be a literal spec this repo must mirror
line-for-line.

## Scope decision (2026-08-12): React reopens component parity, pursued incrementally

`@astrojs/react` is now a project dependency. The rationale the 2026-08-11 decision rested
on — "an `.astro` file cannot be dropped into that canvas; it isn't a runtime component
model Claude Design can render or take props against" — no longer fully holds. A `.tsx`
port *can* be dropped into that canvas's own format: same JSX, same `.d.ts` prop shape,
same `style={{ ... }}` token references upstream already writes. That doesn't eliminate
hand-translation, it shrinks it from "re-implement in a different component model" to
"copy, then verify the copy still matches" — which is what actually addresses drift
mechanism #1 below.

**Decision: component-level parity in `src/components/terminal/` is an active, scheduled
sync target again, pursued incrementally, not as a single cutover.** The 2026-08-11
decision above is kept as historical record, not deleted — it was the right call under a
constraint (no React) that no longer applies. Practically:

- Existing `.astro` ports convert to `.tsx` one component at a time, worst-drift first per
  `terminal/README.md`'s ledger — `StatusLine` (G2), `SegmentBar`/`PromptLine` (G1), then
  `Button`/`TerminalWindow` (F1/F2) — followed by the six upstream components with no
  local port at all (`Kicker`, `Heading`, `Panel`, `Swatch`, `CodeBlock`, `ConfigFile`).
- Each conversion is a near-verbatim copy of the upstream `.jsx` + `.d.ts`, fetched live,
  not a re-derivation. Tokens are referenced the same way upstream references them
  (`var(--*)` in inline `style={{}}`), rather than re-expressed as Astro scoped CSS.
- None of the current seven name-matched components hold client-side state, so their
  `.tsx` ports render through Astro with **no `client:*` directive** — SSR'd to static
  HTML, zero shipped JS, the same zero-JS-by-default posture the `.astro` versions had. A
  hydration directive is added only when a specific component (e.g. `CodeBlock`'s copy
  button) has genuine interactive behavior.
- This does not add a pull mechanism — see below, unchanged. `list_files` → `read_file` →
  local `Write` is still a manual loop. React only makes what gets written at the end of
  that loop closer to a literal copy, which is what shrinks drift risk, not the loop
  itself.
- The four local-only components (`SegmentRule`, `PageBanner`, `StreamItem`,
  `ThemeToggle`, `FeaturedEntry`) have no upstream counterpart to port from and stay
  `.astro`. `SectionHeader` is a name collision, not a port (F3); whether it's renamed
  locally or a real port of upstream's `SectionHeader` is added alongside it under a
  different name is deferred to when that specific conversion comes up.
- Tracking moves from `terminal/README.md`'s hand-written comparison tables to a vendored
  upstream snapshot (fetched `.jsx`/`.d.ts` source committed verbatim, likely alongside
  the existing token journal in `design-system/`) — drift becomes a `git diff` against a
  real file instead of a prose table someone has to remember to update. The existing
  ledger stays as the dated historical record of pre-2026-08-12 findings; it is not
  actively re-derived by hand going forward.

## The core problem: one-way sync, no pull mechanism

The design system is hand-ported into `.astro`. There is no build step, no codegen,
and nothing that pulls changes from Claude Design into this repo automatically:
`write_files`'s `local_path` field returns "not yet implemented", and `copy_files` is
project-to-project only, not project-to-filesystem. Reading is a manual agent loop —
`list_files` → `read_file` → local `Write` — done by whoever is verifying a port.

That means upstream can change and this repo will not notice on its own. Worse, it
fails silently rather than loudly: a stale port still compiles, still renders, and
looks correct until someone diffs it against the source.

## Drift mechanisms

Concrete ways the local side goes stale without anything failing:

1. **Structural CSS is re-implemented, not shared.** Upstream components style
   themselves with inline `style={{}}` objects built from `var(--*)` references —
   layout geometry like clip-path shapes, pixel offsets, and gaps has to be hand-
   translated into a local `<style>` block, since there's no shared stylesheet
   between a React `.jsx` file and an Astro scoped style. Once translated, nothing
   keeps the two in sync — a geometry change upstream has no way to propagate.
   `SegmentBar`'s clip-path/`--pl-overlap` handling is the illustrative case; see
   `terminal/README.md`'s Category C for the current, verified state of it (the
   original assumption that it was hard-coded turned out to be wrong once actually
   read — it's tokenised — which is itself a reminder to verify rather than assume).
   As of the 2026-08-12 decision, this is the mechanism `.tsx` ports specifically
   address: a React port keeps the same `style={{}}` object verbatim, so there's no
   translation step left to go stale.

2. **Tokens get renamed, not just revalued.** A value change (`--accent` goes from
   one hex to another) is low-stakes — re-vendor the CSS and it's visibly fixed. A
   *rename* (`--surface-raised` changes meaning, `--space-2…11` collides with an
   existing `--space-1…8` scale) is dangerous specifically because it doesn't fail:
   the old name still resolves to *something* — a stale value, an unrelated token,
   or nothing with a CSS custom property silently falling through — and the build
   stays green. `design-system/README.md` exists mainly to catch this category
   early, via a sorted token-name diff rather than a value diff. `tokens/README.md`
   logs the renames found so far.

3. **Prop surfaces and whole components drift out of parity.** A local port can drop
   a prop (no `disabled` state, no `width` override), diverge in what a prop means,
   or simply never get written at all — six of the thirteen upstream components have
   no local port as of the last full read. None of this breaks anything locally; it
   just means the local component can do less than its upstream source, silently.
   `terminal/README.md`'s prop tables and Category H track this.

## Recommendations

Mitigations actually built against the mechanisms above. As of the 2026-08-12 decision,
#3 (tokens) and #4 (vendored component snapshots) are both active, scheduled practices;
#2 (the old prose-ledger re-verification procedure) is kept as a historical tool,
superseded by #4; #1 (the styleguide page) stays a useful reference, now doubling as the
side-by-side view for in-progress conversions.

1. **`src/pages/_styleguide.astro` exists and stays useful as a visual reference** —
   every local port rendered in both theme modes, in one place. The underscore prefix
   ([Astro's built-in "excluding pages"](https://docs.astro.build/en/guides/routing/#excluding-pages))
   means it has **no route at all — not in `pnpm dev`, not in `pnpm build`.** To
   actually view it, temporarily rename it to `styleguide.astro` (drop the `_`), view
   it, then rename it back before committing. As `.astro` ports convert to `.tsx`, this
   is the page to swap each import in and eyeball the conversion side by side before
   the old `.astro` file is deleted.

2. **The old `terminal/README.md` "Re-verifying a port" procedure is historical, not
   the active practice going forward.** It's a real, dated snapshot of pre-2026-08-12
   divergence — keep it as history, don't hand-update it for new conversions. Re-run it
   only if there's a specific reason to care about a component that hasn't been
   converted yet.

3. **Track upstream token changes cheaply, before reading everything.** `design-system/`'s
   `etags.json` and `tokens-snapshot.json` are for this: one `list_files` call with
   `depth: -1` answers "did anything change, and where" far more cheaply than re-reading
   every component's source. The token manifest gets its own snapshot specifically
   because a rename is invisible in a CSS re-vendor but obvious in a sorted name diff —
   see `design-system/README.md` for the full capture and diffing procedure, and current
   findings.

4. **Vendor upstream component source verbatim instead of hand-updating a comparison
   table — the active practice for component-level drift going forward.** Each time a
   component is fetched via `read_file` for conversion (or re-checked later), commit the
   raw `.jsx` + `.d.ts` alongside the existing token journal in `design-system/`. Drift
   detection becomes `git diff` against that vendored copy — the same value-vs-rename
   distinction that motivates the token snapshot in #3 applies here too, and a real diff
   catches both without relying on someone remembering to re-read a prose table.

## Prerequisite for any of this: MCP access

Live `mcp__claude-design__*` / `DesignSync` tool access was granted 2026-08-11 via
`/design-login`. The token baseline in `design-system/` is captured from it, live,
etag-backed. Before that, this repo's only option was a one-off export (a downloaded zip
of the Claude Design project, read directly) — see the banner at the top of
`terminal/README.md` for how that worked in practice. A zip pass answers "what's the
current structural state" without answering "has anything changed since," since it has no
etag; prefer live access now that it's available.
