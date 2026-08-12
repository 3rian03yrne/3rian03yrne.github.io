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

Mitigations actually built against the mechanisms above. Given the scope decision above,
only #3 (tokens) is an active, scheduled practice; #1 and #2 are kept as useful tools but
not things to run proactively against component drift anymore.

1. **`/styleguide` (`src/pages/styleguide.astro`) exists and stays useful as a visual
   reference** — every local port rendered in both theme modes, in one place. Not
   something to actively maintain parity against a `.jsx` source for; just a good page
   to have when eyeballing the local design language.

2. **Manual port re-verification (`terminal/README.md`'s "Re-verifying a port"
   procedure) is not a scheduled activity.** The existing ledger is a real,
   dated snapshot of component-level divergence — useful history, not a todo list to
   keep clearing. Only re-run it if there's a specific reason to care about a specific
   component's prop parity (e.g. deciding whether to backport one specific upstream
   feature), not as general drift-prevention.

3. **Track upstream token changes cheaply, before reading everything — this is the one
   active practice.** `design-system/`'s `etags.json` and `tokens-snapshot.json` are
   for this: one `list_files` call with `depth: -1` answers "did anything change, and
   where" far more cheaply than re-reading all thirteen components' source. The token
   manifest gets its own snapshot specifically because a rename is invisible in a CSS
   re-vendor but obvious in a sorted name diff — see `design-system/README.md` for the
   full capture and diffing procedure, and current findings.

## Prerequisite for any of this: MCP access

Live `mcp__claude-design__*` / `DesignSync` tool access was granted 2026-08-11 via
`/design-login`. The token baseline in `design-system/` is captured from it, live,
etag-backed. Before that, this repo's only option was a one-off export (a downloaded zip
of the Claude Design project, read directly) — see the banner at the top of
`terminal/README.md` for how that worked in practice. A zip pass answers "what's the
current structural state" without answering "has anything changed since," since it has no
etag; prefer live access now that it's available.
