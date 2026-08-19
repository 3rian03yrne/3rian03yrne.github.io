# App page standard

The bar every entry in `src/content/projects/` is reviewed against. Two halves: the
**frontmatter contract** (what the layout needs) and the **body template** (what the
reader needs). Rules are stated as requirements; a deliberate exception is fine but
gets a reason recorded next to the file, per `design-system-origins.md`.

## What the layout already renders

`src/pages/projects/[...slug].astro` puts all of this on the page around the Markdown
body:

| Element | Comes from |
| --- | --- |
| Ship/WIP pill, ship date or "in build" | `status`, `shipDate` |
| "App Store" / "Coming soon" label, version | `appStoreUrl`, `version` |
| 96px app icon and `<h1>` | `appIcon`, `title` |
| Standfirst paragraph under the title | `description` |
| Apple download badge, or a "Coming soon" line | `appStoreUrl` |
| Screenshot, below the body | `screenshot`, `screenshotAlt` |
| Embedded privacy-policy PDF | `privacyPolicy` |
| Footer with contact email and privacy link | `contactEmail`, `privacyPolicy` |

**The body must not restate any of it.** A `## Download`, `## Screenshots`,
`## Privacy`, or `## Support` heading in the Markdown is a finding every time — the
layout owns those, and a duplicate is a second, drifting copy. Same for opening the
body with the `description` sentence: it is already the paragraph directly above.

## Frontmatter contract

`src/content.config.ts` enforces types and the shipped/unshipped interlocks. Zod
cannot check the things below, so the review does.

### Required on every app

| Field | Standard |
| --- | --- |
| `title` | The App Store name, exactly. No tagline glued on with a dash or colon. |
| `description` | One sentence, roughly 90–160 characters, naming what the app does and who it is for. It works three jobs at once — page standfirst, `<meta name="description">`, and the stream card when `tagline` is absent — so it has to read as prose *and* as a search result. No "An app that…" or "This app lets you…" preamble; start with the thing itself. |
| `appIcon` | The real App Store icon, square, 1024×1024 PNG. Ship it with square corners — the layout applies its own 20px radius, and a baked-in radius double-rounds. |

### Required once an app has shipped

Shipped means `status` is not `coming_soon` **and** `shipDate` is set — that is
`isShipped()` in `src/lib/stream.ts`, the single test the whole site reads from.

| Field | Standard |
| --- | --- |
| `screenshot` | Mandatory. A shipped app with no screenshot is the most damaging gap on the page: the stream card falls back to the icon, and the reader never sees the app. Real device capture, no marketing frame or drop shadow. At least 640px wide — the layout renders it at `max-width: 320px`, so anything under 2× is visibly soft on a retina display. |
| `screenshotAlt` | Mandatory whenever `screenshot` is set. The route falls back to `alt=""`, which silently marks a meaningful image as decorative and hides it from screen readers. Describe what is on the screen — the state, the numbers, the mode — not "a screenshot of the app". |
| `version` | Matches what is live on the App Store today. Bare semver, no `v` prefix (`1.2.0`), because the layout prints it raw next to "App Store". |
| `appStoreUrl` | The canonical listing: `https://apps.apple.com/us/app/<slug>/id<digits>`. No campaign or referrer query string. |
| `contactEmail` | An address that is actually monitored — it is the app's support route and Apple expects one to exist. |
| `privacyPolicy` | A path into `public/`, e.g. `/privacy-policy.pdf`. Not run through the image pipeline. One PDF per app once there is more than one app; `/privacy-policy.pdf` is already ambiguous. |

### Optional, but held to a standard when present

| Field | Standard |
| --- | --- |
| `tagline` | 60 characters or fewer, no closing full stop. It replaces `description` on stream cards, so it must be a *label*, not a truncated sentence — different register, not the same words cut short. |
| `startDate` | On a `coming_soon` app only, to hold it in chronological position in the stream. Without it the app leads the stream indefinitely. |

## Body template

150–400 words. This is a product page, not a post — the build story, the release
notes, and the reflection belong in a blog entry, which links back through
`releaseProject` / `releaseVersion`.

```markdown
<Lede: one or two short paragraphs, no heading.>

## Features

- <4–8 bullets>

## How it works

<Optional. One paragraph or 3–5 bullets.>

## About

<Why this app exists, in the author's voice.>

## What's next

<Optional; unshipped apps only.>
```

### Lede — required, no heading

One or two short paragraphs answering what it is, who it is for, and why it exists.
It sits immediately under the standfirst, so it must **not** repeat `description`
even loosely — it earns its place by going one step further than the summary did.

### `## Features` — required

Four to eight bullets. Each one names a capability *and* what the reader gets from
it, in that order. Present tense, second person where a person appears. No trailing
periods. No "Users can" — the reader is the user.

> - Needle-style analog dial with a glowing indicator
> - Reference Tone button for tuning by ear

Every bullet must be verifiable — from the repo, the App Store listing, or the
author. A feature nobody can confirm does not go on the page.

### `## How it works` — optional

Include it when the app does something a reader would otherwise doubt: real-time
pitch detection off the microphone, working offline, generating printable output.
Skip it when the app is self-evident. It buys trust, so keep it factual and short.

### `## About` — required on shipped apps

Where the app came from and why it was built: the itch, the person it was for, the
tradition it draws on. This is the section a template cannot generate and the only
one that reads as a person rather than a listing — on a personal site it is the
point of having an app page at all.

Written in the author's first person. **Never draft it from inference.** If the
origin is not already on the page or in a linked post, ask.

### `## What's next` — optional, unshipped only

What is still being built. Never commit to a date; the stream already shows "in
build", and a missed date on a static page ages badly.

## Voice

Present tense. Second person for what the reader does, first person singular for the
author. Plain statements over exclamation marks — the terminal design system is
understated, and hard-sell copy fights it. Say "The needle glows red to green as it
sweeps", not "You'll LOVE how it feels!".

Voice is the author's, not the reviewer's. Flag copy that fights the design system,
propose an alternative, and let the author choose — never quietly restyle their
sentences on the way past.

## Assets

Live in `src/assets/`, referenced from frontmatter by relative path
(`../../assets/<name>.png`) so Astro's `image()` pipeline processes them. Name them
`<slug>-icon.png` and `<slug>-screenshot.png` to match the entry's filename. PDFs and
anything else served verbatim go in `public/` and are referenced by absolute path.

## Known limitation

The schema carries exactly one `screenshot`. An app that needs a gallery cannot have
one without a schema and layout change — raise it as a proposal, do not work around
it by pasting extra images into the Markdown body, which would sidestep the image
pipeline and land unoptimised in the output.
