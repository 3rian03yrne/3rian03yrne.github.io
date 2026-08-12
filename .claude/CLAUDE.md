# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Overview
This is the personal website of Brian O'Byrne. 

# Current State
The repo was succesfully migrated from [Jekyll](https://jekyllrb.com/) to [Astro](https://astro.build/).

# Hosting
The site is a static site hosted on Github pages.

## GitHub Pages Limitations
GitHub Pages only serves static files, so this constrains which Astro features are usable.

**Astro features that don't work on GitHub Pages:**
- `output: 'server'` or `output: 'hybrid'` and any SSR adapter (Node, Deno, etc.) — GitHub Pages cannot execute server code, so `output` must stay `'static'` (the current default/config).
- Astro Actions — they require a server output to run backend functions.
- Server islands (`server:defer`) — same requirement, need an adapter/server.
- On-demand API routes/endpoints — Astro endpoints only work if pre-rendered at build time; anything meant to run per-request (auth, form handling, dynamic data) needs an external service (e.g. a form-handling API, serverless function elsewhere) called from client-side JS.
- Server-only environment variables/secrets — everything shipped to GitHub Pages is public static output, so no secrets can be used at request time; only build-time public env vars (`PUBLIC_*`) are safe to reference in code.
- Middleware — only runs at build time for prerendered pages, not per-request.

**Project setup implications:**
- `site` and `base` must be configured in `astro.config.mjs` to match the GitHub Pages URL (`https://<username>.github.io` and `/<repo>` respectively, unless the repo is named `<username>.github.io`).
- Deploys go through a GitHub Actions workflow (`withastro/action`) that builds the static output and publishes it — see [Astro's GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/).

**GitHub Pages service limits** (from [GitHub's docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)):
- Published site size: max 1 GB (source repo recommended to also stay under 1 GB).
- Bandwidth: soft limit of 100 GB/month.
- Builds: soft limit of 10/hour (doesn't apply when deploying via a custom GitHub Actions workflow, which is what this repo uses).
- Deployments time out after 10 minutes.
- One user/organization Pages site per account.

**GitHub's Terms of Service for Pages** (from [GitHub's terms](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features)), since this is free hosting under GitHub's ToS:
- Pages is intended for static personal/project showcase sites — not as free hosting for an online business, e-commerce site, or commercial SaaS. Donation/crowdfunding buttons are explicitly fine.
- Don't use Pages for sensitive transactions (e.g. passwords, credit card numbers) — there's no secure backend to handle them anyway given the static-only constraint above.
- Must also comply with GitHub's general [Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) (no spam, malware, excessive automated bulk activity, etc.).

None of this is a practical concern for this site (a personal portfolio/blog), but it rules out adding a server-backed feature (e.g. a contact form processed server-side, gated content, live database-backed app) directly in this repo — that would need an adapter-based host (Vercel, Netlify, Cloudflare, etc.) or a separate external service called from the client.

# Documentation

The Astro Documentation is available via mcp connector, and should be used to get the latest documenation. Assume that your current knowledge of Astro is out of date.

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

@standards/astro-tailwind-typography.md
@standards/design-system-sync.md
