/**
 * Claude Code statusline, composed over SegmentBar.
 *
 * The two shapes are not the same content in two skins. `pill` puts the
 * context ramp (`level` → `--ctx-*`) on the trailing cell; `powerline` uses
 * the static `--status-trail-*` pair and hand-composes `model | cost` into one
 * cell's label with a dimmed pipe.
 */
import type { CSSProperties } from "react";
import { SegmentBar } from "./SegmentBar";

export interface StatusLineProps {
  /** slanted lead badge. Default "CLAUDE" */
  lead?: string;
  model?: string;
  cost?: string;
  /** context gauge, e.g. "92k / 200k" */
  trail?: string;
  /** context-usage band — drives the trailing pill's fill. Pill shape only. */
  level?: "nominal" | "steady" | "warn" | "critical";
  /** powerline = slanted lead + piped middle · pill = four detached capsules */
  shape?: "powerline" | "pill";
  style?: CSSProperties;
}

/** Claude Code statusline. */
export function StatusLine({
  lead = "CLAUDE",
  model = "claude-opus-4.6",
  cost = "$0.42",
  trail = "92k / 200k",
  level = "steady",
  shape = "powerline",
  style,
}: StatusLineProps) {
  if (shape === "pill") {
    return (
      <SegmentBar
        shape="pill"
        style={style}
        segments={[
          {
            label: lead,
            bg: "var(--status-lead-bg)",
            fg: "var(--status-lead-fg)",
            weight: 700,
            padding: "4px 14px",
          },
          { label: model, bg: "var(--surface-chip)", fg: "var(--text-1)" },
          { label: cost, bg: "var(--surface-chip)", fg: "var(--accent-3)" },
          {
            label: trail,
            bg: `var(--ctx-${level})`,
            fg: "var(--ink-on-ctx)",
            weight: 700,
          },
        ]}
      />
    );
  }

  const mid = (
    <>
      <span>{model}</span>
      <span style={{ color: "var(--text-dim)" }}>|</span>
      <span>{cost}</span>
    </>
  );

  return (
    <SegmentBar
      style={{ display: "inline-flex", flexWrap: "nowrap", ...style }}
      segments={[
        {
          label: lead,
          bg: "var(--status-lead-bg)",
          fg: "var(--status-lead-fg)",
          clip: "var(--pl-slant-lead)",
          padding: "8px 22px 8px 14px",
          weight: 700,
        },
        {
          label: (
            <span
              style={{
                display: "flex",
                gap: "var(--space-12)",
                alignItems: "center",
              }}
            >
              {mid}
            </span>
          ),
          bg: "var(--status-mid-bg)",
          fg: "var(--status-mid-fg)",
          padding: "8px 24px",
          overlap: true,
        },
        {
          label: trail,
          bg: "var(--status-trail-bg)",
          fg: "var(--status-trail-fg)",
          clip: "var(--pl-slant-trail)",
          padding: "8px 16px 8px 28px",
          weight: 700,
          overlap: true,
        },
      ]}
    />
  );
}
