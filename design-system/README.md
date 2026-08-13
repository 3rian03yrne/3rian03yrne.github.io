# Upstream design system snapshots

Committed snapshots of the **PADD Terminal Design System** in Claude Design, project
`2164f014-2a4d-48fa-86c3-43a00d63c2fb`.

| File | Contents |
| --- | --- |
| `etags.json` | **upstream** — every file in the design system, path → etag, sorted by path |
| `tokens-snapshot.json` | **upstream** — the `tokens[]` array from `_ds_manifest.json`, sorted by scope then name |
| `tokens-local.json` | **local** — the tokens actually declared in `src/styles/tokens/*.css`, same shape and sort |
| `normalize.mjs` | Turns raw MCP output into the two upstream files, deterministically |
| `inventory-local.mjs` | Regenerates `tokens-local.json` from the local CSS. Needs no MCP access |
| `upstream/` | **upstream** — vendored component source, verbatim, one directory per component group |

> **Status: baseline captured 2026-08-11**, live via MCP (`/design-login` granted access).
> `etags.json` (91 files) and `tokens-snapshot.json` (372 rows) are real captures, diffed
> against a freshly regenerated `tokens-local.json` (331 rows). Findings: no renames, no
> value drift on anything actually vendored. Two real gaps, logged in
> `../src/styles/tokens/README.md`'s "Confirmed gaps" section rather than duplicated here —
> the context-escalation ramp (`--ctx-*`, `--amber`, `--coral`, `--ink-on-ctx`) was never
> vendored, and `--text-body`/`--text-label` are name collisions with unrelated upstream
> `compat.css` aliases, not ports of them.
>
> These snapshots were previously gitignored, which silently broke the `git diff
> design-system/` step below — nothing could ever show as changed. Fixed by removing the
> `design-system/` entry from `.gitignore`; commit these files going forward so the next
> capture has something to diff against.
>
> One normalization bug found and fixed while capturing this baseline: `normalize.mjs`'s
> `tokens` mode required every row to carry an explicit `scope`, but the live
> `_ds_manifest.json` only sets `scope` on theme/mode overrides — base `:root` tokens omit
> it. Now defaults a missing `scope` to `:root` instead of failing.

> **Component snapshot captured 2026-08-12** into `upstream/`: all 13 components across
> the 4 group directories (`console/`, `primitives/`, `spec/`, `typography/`) —
> `console/CodeBlock`, `console/PromptLine`, `console/SegmentBar`, `console/StatusLine`,
> `console/TerminalWindow`, `primitives/Button`, `primitives/Panel`, `primitives/Pill`,
> `primitives/Swatch`, `spec/ConfigFile`, `typography/Heading`, `typography/Kicker`,
> `typography/SectionHeader` — each as its `.jsx` + `.d.ts` + `.prompt.md` triple, 39 files
> total, fetched verbatim via `read_file`. This matches `etags.json`'s `components/**`
> listing exactly, with no discrepancies against the expected 13-component list. The one
> finding: `etags.json` also lists four `*.card.html` entries, one per group directory
> (`console/console.card.html`, `primitives/primitives.card.html`,
> `spec/spec.card.html`, `typography/typography.card.html`) — these are Claude Design's
> gallery/preview markup for each group, not component source, and were deliberately not
> vendored into `upstream/`.

Nothing here is read by the site. `design-system/` sits outside `src/`, so Astro never
sees it. It is a journal, not code.

`tsconfig.json` excludes this directory from type-checking on purpose — `include` is
`["**/*"]` and `astro/tsconfigs/strict` sets `allowJs: true`, so without the exclude the
two `.mjs` files here would become tsc program roots. That is latent rather than active
today (the repo has no typescript, no `@astrojs/check`, and no `check` script), which
makes it exactly the kind of entry someone tidies up as unnecessary. **Leave it in place**
— the surprise arrives the first time a check script is added.

## Why this exists

The design system is hand-ported into `.astro`, and the sync is **one-way with no pull
mechanism** — `write_files` has a `local_path` field that returns *"not yet
implemented"*, and `copy_files` is project-to-project only. Reading is an agent loop:
`list_files` → `read_file` → local `Write`. See
`.claude/standards/design-system-sync.md` for the full research.

That means upstream can change and this repo will not notice. Worse, the two ways it
changes fail differently:

- **A value changes** (`--accent` goes from one hex to another). Re-vendoring the token
  CSS fixes it. Low stakes — you can see it.
- **A token is renamed** (`--surface-raised` changes meaning, `--text-display` moves from
  26px to 40px, the `--space-2…11` scale collides with `--space-1…8`). The `.astro` files
  keep referencing the old name. **It still compiles, still renders, and is silently
  wrong.** `src/styles/tokens/README.md` already logs three of these.

The second failure mode is the reason for `tokens-snapshot.json` specifically. A rename
is invisible in a CSS re-vendor but obvious in a sorted token diff.

`etags.json` answers the cheaper question first: *did anything upstream change at all,
and where?* One `list_files` call covers the whole tree, so the check costs one MCP round
trip rather than 88 `read_file` calls.

## Re-capture procedure

**This is an agent procedure, not a script.** There is no local CLI for the Claude Design
MCP — the tools exist only inside a Claude session. `normalize.mjs` cannot fetch
anything; it only reshapes JSON you paste into it.

You need MCP access granted (`/design consent`) before step 1. **Read-only: never call
`write_files`, `copy_files`, or `delete_files` against the design system project.**

### 1. Capture the file tree

```
mcp__claude-design__list_files
  project_id: 2164f014-2a4d-48fa-86c3-43a00d63c2fb
  depth: -1
```

`depth: -1` returns the full tree, files only, no directory stubs, each with its etag.
Write the raw result to a scratch file, then:

```sh
node design-system/normalize.mjs etags < /tmp/raw-listing.json > design-system/etags.json
```

### 2. Capture the tokens

Find `_ds_manifest.json` in the listing (its path is a key in `etags.json`) and read it:

```
mcp__claude-design__read_file
  project_id: 2164f014-2a4d-48fa-86c3-43a00d63c2fb
  path: <the _ds_manifest.json path>
```

The body comes back HTML-entity-escaped — decode `&amp;` `&lt;` `&gt;` before parsing.
The manifest is large; if it exceeds the 256 KiB per-call cap, page through it with
`offset`/`limit` and concatenate. Write the raw JSON to a scratch file, then:

```sh
node design-system/normalize.mjs tokens < /tmp/raw-manifest.json > design-system/tokens-snapshot.json
```

### 3. Refresh the local half

```sh
node design-system/inventory-local.mjs > design-system/tokens-local.json
```

No MCP needed — it parses `src/styles/tokens/*.css` directly. Re-run it whenever those
files are re-vendored, so the two halves are always as-of the same moment.

### 4. Read the diff

```sh
git diff design-system/
```

Pass `--date=YYYY-MM-DD` to either script to pin `capturedAt` to the *previous* capture's
date if you want a diff of content alone, with no date line in the way.

To compare the two halves against each other rather than against history:

```sh
diff <(grep '{"scope"' design-system/tokens-snapshot.json) \
     <(grep '{"scope"' design-system/tokens-local.json)
```

Both files sort identically and emit one token per line with the same key order, so this
is a straight line-for-line comparison.

## The `amber` / `cerritos-map` scope-name mismatch

Local renamed its `data-theme` value from upstream's `cerritos-map` to `amber` (see
`.claude/standards/design-system-sync.md`'s history and `../src/styles/tokens/README.md`).
Upstream's scope selector is still literally `[data-theme="cerritos-map"]`. Diffing the two
token files as-is makes every single warm-theme token look like a removed+added rename pair —
substitute one name for the other in a copy before diffing, the way the current
`tokens-snapshot.json` vs `tokens-local.json` comparison did. Don't rename the local token
back to `cerritos-map` to "fix" this; the mismatch is permanent and intentional.

## How to read the diff

**`etags.json` — one changed line means one changed file.** Etags are opaque; the value
tells you nothing except *not what it was*. Treat a changed etag as "go read that file".

The three paths worth reacting to hardest:

- `_ds_manifest.json` — tokens moved. Go to step 2.
- anything under `tokens/` — re-vendor into `src/styles/tokens/`.
- `_ds_bundle.js` — a component's implementation changed. Structural CSS
  (`SegmentBar`'s chevron geometry, `--pl-overlap`) is re-implemented in this repo, not
  shared, so it propagates zero percent with no warning.

**`tokens-snapshot.json` — watch for removed+added pairs.** Each token is one line,
`scope` and `name` first, so:

```diff
-		{"scope":":root","name":"--surface-raised","kind":"color","value":"var(--raised)"},
+		{"scope":":root","name":"--surface-tier-1","kind":"color","value":"var(--raised)"},
```

Same value, different name — **this is the silent breakage.** Every `var(--surface-raised)`
in `src/` still resolves to nothing and falls back, and the build stays green. Grep for
the removed name across `src/` before doing anything else:

```sh
grep -rn -- '--surface-raised' src/
```

A pure value change on an unchanged line is the benign case:

```diff
-		{"scope":":root","name":"--accent","kind":"color","value":"#52e8d4"},
+		{"scope":":root","name":"--accent","kind":"color","value":"#4fd9c6"},
```

Re-vendor `colors.css` and move on.

Because sorting is by scope then name, a token added to all four theme scopes shows up as
four additions spread across the file rather than one block. That is expected — the four
scopes are `:root`, `[data-theme="amber"]`, `[data-mode="light"]`, and
`[data-theme="amber"][data-mode="light"]`, and a token missing from one of them is
itself a finding.

## The local half (`tokens-local.json`)

Re-captured 2026-08-11 (unchanged from 2026-08-08 except the `cerritos-map`→`amber` scope
rename): **331 tokens across 4 scopes** — `:root` (126), `[data-mode="light"]` (75),
`[data-theme="amber"]` (64), and `[data-theme="amber"][data-mode="light"]` (66).

Upstream's real capture landed at **372 rows**, ~40 more than local. Diffed against the
331 local rows (methodology above), the gap resolves to: `compat.css` and `fonts.css` are
deliberately not vendored (`--font-display`/`--font-mono` included — see
`src/styles/tokens/README.md`), and the context-escalation ramp (`--ctx-*`, `--amber`,
`--coral`, `--ink-on-ctx`) was never vendored at all — a real, previously-untracked gap,
now logged in `src/styles/tokens/README.md`'s "Confirmed gaps" section. No token that
exists on both sides was renamed or changed value.

Two caveats when diffing this against the upstream snapshot:

**`kind` is inferred locally, not read.** CSS carries no type information, so
`inventory-local.mjs` guesses: it honours an upstream `/* @kind x */` annotation where one
survived the vendoring, then resolves `var()` chains within the scope and classifies the
result as `color`, `dimension`, or `other`. The manifest is authoritative. **Diff on
`scope` + `name` + `value` and treat a kind-only difference as noise.**

**Values are compared as authored, not as computed.** Upstream may record `#52e8d4` where
the vendored CSS says `var(--cyan)` — the same colour, a textual difference. `:root` uses
`var()` aliases heavily while the theme scopes mostly inline literals, so expect this
asymmetry and don't read it as drift.

## The `upstream/` component snapshot

`upstream/` is the component-level analogue of the token snapshot above: a committed,
verbatim copy of upstream component source, so drift is a `git diff` against a real file
instead of a prose comparison someone has to remember to keep current.

This exists because of the scope reversal documented in
`.claude/standards/design-system-sync.md`'s **2026-08-12 decision** (Recommendation #4).
The 2026-08-11 decision in that file had scoped this repo's active sync target down to
tokens only, on the grounds that an `.astro` file isn't a runtime component model Claude
Design's React-based canvas can render or take props against — so tracking component
parity meant hand-updating `terminal/README.md`'s comparison tables forever, by hand, with
no way to close the gap. Adding `@astrojs/react` reopened that: a `.tsx` port can be a
near-verbatim copy of the upstream `.jsx` + `.d.ts` (same JSX, same prop shape, same
`style={{ var(--*) }}` token references), which shrinks the work from "re-implement in a
different component model" to "copy, then verify the copy still matches" — and a vendored
copy is what makes that verification a diff instead of a memory exercise.

Practically, that means:

- **Detection is `git diff` against `upstream/`, not hand-updating `terminal/README.md`.**
  Re-fetch a component via `read_file` (during a conversion, or on a standalone recheck),
  overwrite the vendored copy, and `git diff design-system/upstream/` shows exactly what
  changed — value or, more importantly, structural — the same way `tokens-snapshot.json`
  turns a token rename into a visible diff instead of a silent one. `terminal/README.md`'s
  prose tables stay as the dated historical record of pre-2026-08-12 findings; they are not
  re-derived by hand going forward.
- **Layout is one directory per component group** (`console/`, `primitives/`, `spec/`,
  `typography/`), matching upstream's own `components/<group>/` structure, each file kept
  under its original name (`Component.jsx`, `Component.d.ts`, `Component.prompt.md`).
- **`*.card.html` files are excluded on purpose.** Each group directory in Claude Design
  also carries a `<group>.card.html` (visible in `etags.json`) — gallery/preview markup for
  that group, not component source. Vendoring stops at `.jsx`/`.d.ts`/`.prompt.md`; there is
  no local equivalent to compare a `.card.html` against, so pulling it in would just be
  dead weight.
- **This is still the same one-way, no-pull sync as the tokens.** `write_files`'s
  `local_path` is unimplemented and `copy_files` is project-to-project only, so populating
  and re-checking `upstream/` is the same manual `list_files` → `read_file` → local `Write`
  loop as everything else in this file — vendoring just gives that loop something durable
  to diff against afterward.

## Normalization guarantees

Both scripts are deterministic: the same input produces byte-identical output. They sort
with plain codepoint comparison rather than `localeCompare`, so the result does not depend
on the machine's locale. Key order within each token line is fixed (`scope`, `name`,
`kind`, `value`) so a value change never reorders a line.

It fails loudly rather than guessing — a missing `etag`, a missing token field, or a
duplicate path exits non-zero with the offending entry.
