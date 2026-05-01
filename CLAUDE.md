# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal website for Brian O'Byrne, built with Jekyll and hosted on GitHub Pages. Theme is `minima` (pinned via `jekyll-remote-theme` at commit `38a84a9`). Deployment is automatic on merge to `main`.

## Local Development

```bash
bundle install
bundle exec jekyll serve
# Visit http://localhost:4000
```

## Content Creation

New posts and projects use front matter to set layout and metadata. Jekyll Compose is available:

```bash
# New post
bundle exec jekyll post "My New Post"

# New post with timestamp
bundle exec jekyll post "My New Post" --timestamp-format "%Y-%m-%d %H:%M:%S %z"

# Draft workflow
bundle exec jekyll draft "My new draft"
bundle exec jekyll publish _drafts/my-new-draft.md
```

Default front matter for new posts (set in `_config.yml`):

- `category: starship-log`
- `published: false`
- `sitemap: false`

Posts go live when `published` is set to `true`.

## Architecture

**Collections:**

- `_posts/` — Blog posts, rendered via `_layouts/blog.html`
- `_projects/` — Project pages, rendered via `_layouts/projects.html`; listed automatically on `/projects/`

**Layouts** (all extend `default.html`):

- `home.html` — Hero + featured app cards + about strip; content driven by `index.md` front matter
- `blog.html` — Lists all posts with excerpts and "View Post" buttons
- `projects.html` — Lists all `site.projects` with "View Project" buttons
- `project.html` — Individual project page; renders screenshot, App Store badge or coming-soon status, privacy policy embed, and contact footer from front matter
- `default.html` — Base layout inherited from minima theme

**Styling:**

- `assets/main.scss` — Imports the minima theme then applies custom overrides
- Color palette: warm dark earth tones — `$bg: #1a1612`, `$accent: #c4996a`, `$text: #e8e0d4` (full set defined at the top of `assets/main.scss`)
- `.btn` class used for "View Post" / "View Project" action buttons

**Custom includes:**

- `_includes/footer.html` — Overrides the minima footer

**Static assets:**

- `assets/images/` — Images (e.g., App Store badge SVG)
- `assets/docs/` — Documents (e.g., privacy policy PDF)

**Navigation** is driven by `_data/navigation.yml` and rendered via `_includes/header.html` using `site.data.navigation`.

## Jekyll Conventions

All code and content created for this site must follow Jekyll patterns and leverage its built-in capabilities:

- **Front matter** — Every page, post, and project file must have YAML front matter. Use it to set `layout`, `title`, `permalink`, `published`, `category`, and any custom page-specific variables.
- **Liquid templating** — Use Liquid tags (`{{ }}`, `{% %}`) for dynamic content: iterating collections, conditionals, including partials, and accessing `site.*` / `page.*` variables.
- **Layouts and includes** — Extend existing layouts (`home`, `blog`, `projects`, `default`) rather than duplicating HTML. Extract reusable markup into `_includes/`.
- **Collections** — New content types (beyond posts) go in their own `_<name>/` directory (e.g. `_projects/`) and are declared in `_config.yml`, not hand-rolled as static pages.
- **Site data** — Structured data (e.g. nav items, repeated content) belongs in `_data/` as YAML/JSON, accessed via `site.data.*`.
- **CLAUDE.md must stay excluded** — `CLAUDE.md` is listed under `exclude:` in `_config.yml` and must remain there so it is never served as a page.

## Notes

- `_config.yml` is **not** hot-reloaded; restart `jekyll serve` after changes.
- The `_site/` directory is the build output — never edit it directly.
