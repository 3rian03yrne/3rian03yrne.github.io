# Vendored design tokens

These are copies of the **PADD Terminal design system** token files, taken from the Claude Design
project `64e2ad8b-87c6-4420-a879-3bf78070695d` (`_ds/padd-terminal-design-system-2164f014-2a4d-48fa-86c3-43a00d63c2fb/tokens/`).

Keep them close to verbatim so they can be re-synced when the design system changes. Site-specific
adjustments belong in `../global.css`, not in here.

| File             | Status                                                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `colors.css`     | verbatim                                                                                                                                           |
| `spacing.css`    | verbatim                                                                                                                                           |
| `typography.css` | verbatim minus the two `--font-*` declarations — see the note at the top of the file                                                               |
| `compat.css`     | **not vendored.** Deprecated aliases for the pre-merge token names; nothing here uses them.                                                        |
| `fonts.css`      | **not vendored.** It is an `@import` from the Google Fonts CDN; the fonts are self-hosted through Astro's Fonts API in `astro.config.mjs` instead. |

## Why all four colour scopes are kept

The site only ships the `cerritos-map` theme, so the `lcars-padd` blocks look like dead weight. They
are not. `[data-theme="cerritos-map"]` overrides only the theme tokens and inherits the `--page-*`
chrome tokens from `:root`; `[data-theme="cerritos-map"][data-mode="light"]` stands on
`[data-mode="light"]` the same way. Deleting either base block leaves real tokens undefined.
