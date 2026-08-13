# StatusLine

The Claude Code session row. Two geometries:

```jsx
<StatusLine />                                  {/* powerline: slanted lead, piped middle */}
<StatusLine shape="pill" level="warn" trail="148k / 200k" />
```

- `level` maps to the context-escalation ramp: `nominal` (<25%) → `steady` (25–60%) → `warn` (60–85%) → `critical` (≥85%), resolving through `--ctx-*` in whichever theme and mode is active.
- Pill shape detaches every segment with a 4px gap; powerline butts them and slants the outer caps.
- Never mix geometries within one screen — pick per product.
