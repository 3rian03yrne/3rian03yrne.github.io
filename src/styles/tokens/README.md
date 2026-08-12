# Vendored design tokens

These are copies of the **PADD Terminal design system** token files, taken from the Claude Design
project `2164f014-2a4d-48fa-86c3-43a00d63c2fb` ("PADD Terminal Design System").

Keep them close to verbatim so they can be re-synced when the design system changes. Site-specific
adjustments belong in `../global.css`, not in here.

Token sync is the one actively maintained half of the design-system relationship — see
`.claude/standards/design-system-sync.md` for why component-level (React vs Astro) parity is not.
The capture/diff procedure and current findings live in `../../../design-system/README.md`.

| File             | Status                                                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `colors.css`     | verbatim                                                                                                                                           |
| `spacing.css`    | verbatim                                                                                                                                           |
| `typography.css` | verbatim minus the two `--font-*` declarations — see the note at the top of the file                                                               |
| `compat.css`     | **not vendored.** Deprecated aliases for the pre-merge token names; nothing here uses them.                                                        |
| `fonts.css`      | **not vendored.** It is an `@import` from the Google Fonts CDN; the fonts are self-hosted through Astro's Fonts API in `astro.config.mjs` instead. |

## Why all four colour scopes are kept

The site only ships the `amber` theme, so the `cyan` blocks look like dead weight. They
are not. `[data-theme="amber"]` overrides only the theme tokens and inherits the `--page-*`
chrome tokens from `:root`; `[data-theme="amber"][data-mode="light"]` stands on
`[data-mode="light"]` the same way. Deleting either base block leaves real tokens undefined.

## `amber` vs upstream's `cerritos-map`

Upstream's actual `data-theme` selector value is still `cerritos-map` — only the local copy
was renamed (see the "Rename Star Trek-derived naming" commit). This is intentional and will
never resolve on its own: `design-system/tokens-snapshot.json` and `tokens-local.json` will
show every warm-theme token as a removed+added pair unless `cerritos-map` is substituted for
`amber` before diffing. `design-system/README.md`'s diff procedure does this substitution;
don't "fix" the local name back to match, and don't read that pairing as drift.

## Confirmed gaps (live capture, 2026-08-11)

Diffing the first live token capture against the local CSS (methodology in
`design-system/README.md`) found no renames and no value drift on anything actually vendored.
Two real gaps, though:

- **The context-escalation ramp was never vendored.** `--amber`, `--coral`, `--ctx-nominal`,
  `--ctx-steady`, `--ctx-warn`, `--ctx-critical`, and `--ink-on-ctx` don't exist anywhere in
  `colors.css`. This is the token-level cause of `terminal/README.md`'s G2 finding (`StatusLine`
  dropped the context-escalation ramp) — the tokens it would need aren't even here to use.
- **`--text-body` and `--text-label` are name collisions, not gaps.** Upstream defines both in
  `compat.css` (not vendored) as color aliases — `--text-body: var(--text-1)`,
  `--text-label: var(--text-dim)`. Local `typography.css` defines tokens with the *same names*
  but unrelated meaning — real font-size dimensions (`15px`, `10px`). Harmless today only because
  `compat.css` isn't vendored; don't vendor it without renaming one side first.
