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

Mitigations actually built against the mechanisms above, not aspirational ones:

1. **Maintain an Astro-only preview page rendering every local port in both theme
   modes.** This is `/styleguide` (`src/pages/styleguide.astro`) — the cheap half of
   "generate previews from Astro": it can't diff against the upstream `.jsx` by
   itself, but it makes every documented prop combination visible at once, in both
   `data-mode` values, so a caller eyeballing it (or a screenshot diff) has a chance
   of spotting a divergence that a code read alone would miss. Every local component
   should be reachable from it.

2. **Re-verify ports manually, one component at a time, on a known procedure** rather
   than ad hoc. The procedure lives in `terminal/README.md`'s "Re-verifying a port"
   section: list the upstream tree, diff props against the `.d.ts` and `types.ts` for
   *all* components before diffing any styles (cheap structural pass first), diff
   `.jsx` styling only once prop surfaces agree, read the `.prompt.md` for intent,
   look at it rendered in `/styleguide`, then record the result with a verified date
   and a file:line for anything that didn't match. A row whose verified date predates
   the last upstream change should be treated as stale, not trusted.

3. **Track upstream file and token changes cheaply, before reading everything.** This
   is what `design-system/`'s `etags.json` and `tokens-snapshot.json` are for — one
   `list_files` call with `depth: -1` answers "did anything change, and where" far
   more cheaply than re-reading all thirteen components' source on a schedule. The
   token manifest gets its own snapshot specifically because a rename is invisible in
   a CSS re-vendor but obvious in a sorted name diff — see `design-system/README.md`
   for the full capture and diffing procedure.

## Prerequisite for any of this: MCP access

All three recommendations assume live `mcp__claude-design__*` tool access. As of the
last check, those tools refuse every call pending `/design consent`. Where that's
blocked a one-off export (a downloaded zip of the Claude Design project, read
directly) can substitute for a structural pass — see the banner at the top of
`terminal/README.md` for how that worked in practice — but it's a snapshot with no
etag, so it answers "what's the current structural state" without answering "has
anything changed since." Prefer live MCP access once granted; treat a zip-based pass
as better than nothing, not as equivalent.
