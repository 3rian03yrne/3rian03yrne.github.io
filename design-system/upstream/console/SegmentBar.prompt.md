# SegmentBar

The signature motif, in its raw form: flat color blocks butted edge to edge. `PromptLine` and `StatusLine` are opinionated compositions on top of it — reach for `SegmentBar` only when you need a powerline the other two don't cover.

```jsx
<SegmentBar segments={[
  { label: 'NCC-75537', bg: 'var(--accent-2)', fg: 'var(--ink-on-accent)', weight: 700, radius: 'var(--radius-seg) 0 0 var(--radius-seg)' },
  { label: 'DOCKED', bg: 'var(--surface-chip)' },
  { label: '✓', bg: 'var(--accent)', fg: 'var(--status-lead-fg)', weight: 700, radius: '0 var(--radius-seg) var(--radius-seg) 0' },
]} />
```

- Outer ends get `--radius-seg`; interior joins stay square.
- For slanted caps pass `clip: 'var(--pl-slant-lead)'` and `overlap: true` on the following segment.
- Text on accent fills is bold and letter-spaced; always pair a fill with its `--ink-on-accent` / `--status-lead-fg` foreground.
