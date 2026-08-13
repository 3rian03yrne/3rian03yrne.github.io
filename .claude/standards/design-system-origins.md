# Design system origins

Where `src/components/terminal/` and `src/styles/tokens/` came from, and who owns them now.
Imported by `.claude/CLAUDE.md`.

## Origin

Both directories started as hand-ports of the **PADD Terminal Design System**, a design
system built in Claude Design (project `2164f014-2a4d-48fa-86c3-43a00d63c2fb`). The
components were React `.jsx` there; the tokens were plain CSS custom properties. The
components landed here first as `.astro`, then as `.tsx` once `@astrojs/react` was added —
which is why they still style themselves with inline `style={{}}` objects full of
`var(--*)` references rather than in Astro scoped `<style>` blocks.

## `src/` is the source of truth

The Claude Design project is **not** an upstream for this repo. It stays useful as a design
canvas and as the default design system for design artifacts elsewhere (decks, mockups), but
nothing flows from it into `src/` any more. Change a component or a token here directly; there
is nothing to re-derive it against and nothing to keep it in step with.

Two things follow from that:

- There is no drift to detect. Drift only matters in the direction where staleness causes
  harm, and after the flip that direction doesn't exist.
- A local divergence from what the design system does is just a local decision. It needs a
  reason recorded next to the code, not a reconciliation.

## The sync machinery is gone

A one-way sync protocol used to live in `design-system/`: vendored copies of the upstream
component source, token snapshots, an etag journal, and two normalizer scripts, plus prose
ledgers tracking prop-level parity component by component. **Deleted 2026-08-13** — it is in
git history at commit `682b17e` if the detail is ever wanted.

It was never going to work. Claude Design systems are built to be consumed by *other Claude
Design projects* (project-to-project copies, a bound design system), not exported to a git
checkout; there is no filesystem-export mechanism, and its absence is a design decision, not
a gap to work around. Every capture was therefore a manual agent loop, and a stale port
failed silently — it still compiled and still rendered.

`src/pages/styleguide.astro` renders every terminal component in both `data-mode` values.
That page is the useful survivor of all this: it is how you actually look at the components.
