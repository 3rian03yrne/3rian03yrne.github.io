# SectionHeader

Opens every major section and every Panel. Composes `Kicker` + `Heading` on the left, optional metadata on the right, baseline-aligned.

```jsx
<SectionHeader kicker="BRIDGE CONSOLE · COOL" title="lcars-padd" meta="STARDATE 57436.2" />
<SectionHeader small kicker="CONFIG FILES" title="Ghostty" />
```

- `kicker` is always ALL-CAPS; use `·` as the separator.
- `meta` carries in-universe telemetry (stardates, registry numbers) — never body copy.
- `small` drops the kicker to 11px and the title to 26px for use inside panels.
