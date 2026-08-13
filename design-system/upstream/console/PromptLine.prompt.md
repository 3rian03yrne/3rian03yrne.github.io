# PromptLine

The shell prompt as rendered by the Oh My Posh configs this system ships. Four segment kinds, themed by `--prompt-*` tokens so both themes and both modes resolve automatically.

```jsx
<PromptLine />
<PromptLine segments={[
  { label: '~/uss-cerritos/warp', kind: 'path' },
  { label: '⎇ feature/nacelle', kind: 'git' },
  { label: '✓', kind: 'ok' },
  { label: '2.1s', kind: 'time' },
]} />
```

- Order is always path → git → status → time; the time segment is transparent and closes the run.
- Glyphs come from JetBrains Mono (`⎇`, `✓`, `❯`) — never an icon font.
- Needs an arbitrary powerline instead? Use `SegmentBar` directly.
