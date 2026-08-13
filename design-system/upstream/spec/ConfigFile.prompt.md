# ConfigFile

Presents a real, copy-pasteable config file — Ghostty, Oh My Posh, zsh, Claude Code settings. Identical rendering to `CodeBlock`; the distinction is semantic and the `filename` is required, because a config panel without its path is useless.

```jsx
<ConfigFile filename="~/.config/ghostty/config">{`theme = lcars-padd
background = 0a0e14
foreground = cfe0ff`}</ConfigFile>
```

- Never invent config keys. Everything shown must actually work.
- Renders on the neutral `--page-*` ramp so config panels read identically under both themes.
