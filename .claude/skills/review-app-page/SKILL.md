---
name: review-app-page
description: Review an app page in src/content/projects against the site's app-page standard — frontmatter contract, body sections (lede, features, how it works, about), screenshots, and assets. Use when asked to review, audit, improve, or fill out an app/project page, when adding a new app entry, or before shipping an app to the App Store.
---

# Review an app page

Each file in `src/content/projects/` is one app. This skill checks one against
`standard.md`, asks the author what only they can answer, and applies the fixes.

Read `standard.md` before reviewing. It holds the frontmatter contract, the body
template, and what the layout already renders — the review is only as good as that
file, so re-read it rather than working from memory of it.

## The one hard rule

**Never invent a fact about an app.** Features, origin stories, technical claims, and
version numbers either come from the repo, the App Store listing, or the author — or
they get asked about. Fabricated copy on a personal site under the author's name is
worse than an incomplete page, and it is convincing enough that it survives review.
When a section cannot be written from evidence, leave it and ask.

## Process

### 1. Pick the target

Named app → that file. No target named → list `src/content/projects/` and review them
all, worst-scoring first.

### 2. Gather evidence before judging

- The entry itself, and `src/content.config.ts` for the schema currently in force.
- `src/pages/projects/[...slug].astro` — what the layout renders, so the review does
  not ask for something the page already shows.
- The referenced assets: confirm each path resolves, and check screenshot dimensions
  (`sips -g pixelWidth -g pixelHeight <file>`) against the 640px floor.
- Any blog post pointing at this app via `releaseProject` — it often already contains
  the origin story the `## About` section is missing, in the author's own words.
- For a shipped app, fetch the App Store listing to reconcile `version`, `title`, and
  the feature list against what is actually published.

### 3. Report findings before changing anything

One table, worst first. Severity:

- **Blocker** — wrong, missing, or broken for a shipped app: no screenshot, a stale
  `version`, a dead `appStoreUrl`, a missing `screenshotAlt`, a claim that is not true.
- **Should** — the page works but misses the standard: no `## About`, a lede that
  restates `description`, thin features, a body section duplicating layout chrome.
- **Polish** — wording, bullet parallelism, tagline register.

Each finding: what the standard says, what the file does, and the fix. Cite
`file:line`.

### 4. Ask, in one batch

Use `AskUserQuestion` for what evidence cannot settle — batch the questions rather
than interrogating section by section. The ones that come up most:

- Origin — why this app was built, and for whom. Feeds `## About`.
- Which features matter most, when the listing has more than eight.
- Whether a claim found in a listing or an old post is still true.
- Voice, where existing copy fights the design system: keep it or tighten it.
- For an unshipped app: what is still missing before it ships.

Offer a concrete draft as an option where possible — reacting to a sentence is easier
than composing one.

### 5. Apply

Edit the Markdown directly. Rewrite whole sections rather than patching phrases into
someone else's paragraph. Leave anything the author declined untouched, and say so.

Do not change `src/content.config.ts` or the layout as part of a content review. If a
finding actually needs a schema change (a second screenshot, a new field), propose it
and stop there.

### 6. Verify

```bash
pnpm check      # astro check — catches schema violations
pnpm build      # confirms the image pipeline resolves every asset
pnpm prettier   # formats the Markdown
```

A frontmatter mistake usually surfaces as a `pnpm check` failure with the zod message
from `content.config.ts` — read it, it names the field.

### 7. Report

What changed, what the author declined, and what is still open — an unanswered
question or a missing asset the author has to produce (a screenshot, a privacy PDF).
Do not close out a review with a silent gap.

## Adding a new app

Same standard, run forwards: copy `template.md`, fill what is known, ask for the
rest. A new entry starts `status: "coming_soon"` with a `startDate` and no
`shipDate` — the schema rejects the alternatives, and `startDate` is what keeps it
from pinning itself to the top of the stream forever.
