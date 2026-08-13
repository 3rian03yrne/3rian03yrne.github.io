# Design tokens

Every colour, size, spacing step, radius, and border in the site resolves to a CSS custom
property declared in one of these three files. They started as copies of the **PADD Terminal
Design System**'s token files from Claude Design; they are the source of truth now — see
`.claude/standards/design-system-origins.md`.

Site-specific adjustments belong in `../global.css`, not in here. That separation is worth
keeping: these files are the palette as designed, and `global.css` holds the deliberate
deviations from it (currently the light-mode contrast nudges, each with its measured ratio).
Mixing the two makes it impossible to tell which is which.

| File             | Notes                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `colors.css`     | Three tiers — raw hues, semantic aliases, component tokens — across four scopes.                                                                                       |
| `spacing.css`    | Spacing, composite paddings, radii, borders, the one shadow, and the powerline clip-path geometry.                                                                     |
| `typography.css` | Sizes and letter-spacing only. The two `--font-*` declarations are deliberately absent — see the note at the top of the file.                                          |
| `compat.css`     | **Never copied over.** Deprecated aliases for pre-merge token names; nothing here uses them. See the `--text-body`/`--text-label` collision below before importing it. |
| `fonts.css`      | **Never copied over.** It was a Google Fonts CDN `@import`; the fonts are self-hosted through Astro's Fonts API in `astro.config.mjs` instead.                         |

## Why all four colour scopes are kept

The site only ships the `amber` theme, so the `cyan` blocks look like dead weight. They
are not. `[data-theme="amber"]` overrides only the theme tokens and inherits the `--page-*`
chrome tokens from `:root`; `[data-theme="amber"][data-mode="light"]` stands on
`[data-mode="light"]` the same way. Deleting either base block leaves real tokens undefined.

## Naming history

Three name-level facts that a reader will otherwise trip over. None of them is a defect to
fix; they are why the names look the way they do.

**`amber` was `cerritos-map`.** The `data-theme` selector value was renamed locally (see the
"Rename Star Trek-derived naming" commit). The design system it came from still calls the
warm theme `cerritos-map`, so a value that looks unfamiliar next to any design-side artifact
is expected.

**`--text-body` and `--text-label` mean something different here.** In the design system both
are _colour_ aliases declared in `compat.css` (`--text-body: var(--text-1)`,
`--text-label: var(--text-dim)`). Here they are font-size dimensions in `typography.css`
(`15px` and `10px`). Same names, unrelated meanings — harmless only because `compat.css` was
never brought over. Don't import it without renaming one side first.

**Two spacing conventions share one prefix.** `--space-1` through `--space-8` are
_index_-named — the number is a step, not a value, so `--space-6` is 32px. `--space-12`,
`-20`, `-24`, `-40`, `-48` are _value_-named — the number is the pixel count. Every survivor
of the second group is ≥ 12 precisely because those are the names the 1…8 scale doesn't
already own. The consequence: a reference to `--space-2` … `--space-8` is ambiguous on
sight, and `--space-6` in particular reads as 6px under the value convention while
resolving to 32px. Read them as step numbers.

## The context-escalation ramp

`--ctx-nominal` / `--ctx-steady` / `--ctx-warn` / `--ctx-critical` / `--ink-on-ctx`, plus the
`--amber` and `--coral` hues two of them derive from, drive `StatusLine`'s trailing pill.
They are declared in `:root` and `[data-mode="light"]` only, never in either
`[data-theme="amber"]` scope — the ramp encodes rising context usage, so toggling the theme
must not shift it. Light mode writes `--ctx-warn`/`--ctx-critical` as literal hex rather than
`var()`-derived, because there is no light-mode `--amber`/`--coral` to derive from.
