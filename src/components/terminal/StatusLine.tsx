/**
 * Near-verbatim port of the design system's `console/StatusLine.jsx` (+ `.d.ts`).
 * See `.claude/standards/design-system-sync.md`'s 2026-08-12 scope decision.
 *
 * Upstream composes this by rendering `<SegmentBar shape={...} segments={...} />`.
 * `SegmentBar` itself has no local `.tsx` port yet (next in the conversion order),
 * and a `.tsx` can't import a `.astro` file, so its rendering is inlined below as a
 * private helper — replicating `SegmentBar.jsx` faithfully for both shapes it needs
 * (`pill` for StatusLine's pill branch, `powerline` for its default branch). Replace
 * this helper with a real `SegmentBar.tsx` import once that port lands.
 */
import type { CSSProperties, ReactNode } from "react";

interface StatusLineSegment {
  label: ReactNode;
  bg?: string;
  fg?: string;
  weight?: number;
  padding?: string;
  radius?: string;
  clip?: string;
  overlap?: boolean;
}

interface SegmentBarInlineProps {
  segments: StatusLineSegment[];
  shape?: "powerline" | "pill";
  style?: CSSProperties;
}

function SegmentBarInline({
  segments,
  shape = "powerline",
  style,
}: SegmentBarInlineProps) {
  const pill = shape === "pill";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        flexWrap: "wrap",
        gap: pill ? "var(--space-1)" : 0,
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-term)",
        ...style,
      }}
    >
      {segments.map((seg, i) => (
        <span
          key={i}
          style={{
            background: seg.bg ?? "transparent",
            color: seg.fg ?? "var(--text-1)",
            fontWeight: seg.weight ?? 500,
            padding: seg.padding ?? (pill ? "4px 14px" : "var(--pad-segment)"),
            borderRadius: pill ? "var(--radius-pill)" : (seg.radius ?? 0),
            clipPath: pill ? undefined : seg.clip,
            marginLeft: !pill && seg.overlap ? "var(--pl-overlap)" : undefined,
            letterSpacing: "var(--track-term)",
            display: "flex",
            alignItems: "center",
          }}
        >
          {seg.label}
        </span>
      ))}
    </div>
  );
}

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
      <SegmentBarInline
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
    <SegmentBarInline
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
