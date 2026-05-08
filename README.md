## About

This is the personal website of Brian O'Byrne built with [Jekyll](https://jekyllrb.com/) and hosted using [GitHub Pages](https://pages.github.com/).

You can view the site [here](https://3riano3yrne.github.io/).

## License

This repository contains both software (the Jekyll site scaffolding) and creative content (written posts, project pages, and images). They are licensed separately.

**Code** — the Jekyll scaffolding (`_layouts/`, `_includes/`, `_data/`, `_config.yml`, `Gemfile`, `assets/main.scss`, and other configuration or template files used to build the site) is licensed under the [MIT license](/LICENSE.md).

**Content** — the written and visual content authored by Brian O'Byrne (`_posts/`, `_projects/`, `assets/images/`, `assets/docs/`, and the top-level page files such as `index.md`, `about.md`, `blog.md`, `projects.md`, and `404.html`) is **not** covered by the MIT license.

Copyright (c) 2026 Brian O'Byrne. All rights reserved.

## Deployment

Deployment happens automatically as commits are merged into 'main' branch.


## Local Dev

Install Jekyll and Ruby following the [instructions for your OS](https://jekyllrb.com/docs/installation/)
[Mac OS installation](https://jekyllrb.com/docs/installation/macos/)

Run: `bundle install`

Run: `bundle exec jekyll serve`

To view the local site, go to: http://localhost:4000

Press `ctrl-c` to stop the local server.


## Blog Post creating with jekyll-compose

[jekyll-compose](https://github.com/jekyll/jekyll-compose) can be optionally used for post creation. See the [jekyll-compose](https://github.com/jekyll/jekyll-compose) documentation for more details. 

New posts: 
```
 bundle exec jekyll post "My New Post"
```
New post w/ timestamp:
```
bundle exec jekyll post "My New Post" --timestamp-format "%Y-%m-%d %H:%M:%S %z"
```
New drafts:
```
bundle exec jekyll draft "My new draft"
```
Publish drafts:
```
bundle exec jekyll publish _drafts/my-new-draft.md
```
