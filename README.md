## About

This is the personal website of Brian O'Byrne built with [Jekyll](https://jekyllrb.com/) and hosted using [GitHub Pages](https://pages.github.com/).

You can view the site [here](https://3riano3yrne.github.io/).

## License

The original content of this project (including but not limited to images, blog posts, original writing, etc.) is copyrighted by me, as the author and creator of this content:

Copyright (c) 2026 Brian O'Byrne. All rights reserved.

The underlying source code used to format and display the content is licensed under the [MIT license](/LICENSE.md).

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
