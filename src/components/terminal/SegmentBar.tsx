/**
 * Near-verbatim port of the design system's `console/SegmentBar.jsx` (+ `.d.ts`).
 * See `.claude/standards/design-system-sync.md`'s 2026-08-12 scope decision.
 *
 * The primitive PromptLine and StatusLine compose. Two geometries over one
 * segment model: powerline (butted blocks, slanted caps) and pill (detached
 * capsules, 4px gap).
 */
import type { CSSProperties, ReactNode } from "react";

export interface Segment {
  label: ReactNode;
  /** background fill; omit for a transparent trailing segment */
  bg?: string;
  fg?: string;
  weight?: number;
  padding?: string;
  /** powerline shape only — pill shape forces --radius-pill */
  radius?: string;
  /** powerline shape only: clip-path cap, e.g. var(--pl-slant-lead) */
  clip?: string;
  /** powerline shape only: pull left by --pl-overlap so a slanted cap tucks under its neighbour */
  overlap?: boolean;
}

export interface SegmentBarProps {
  segments?: Segment[];
  /** powerline = butted blocks, slanted caps · pill = detached capsules, 4px gap */
  shape?: "powerline" | "pill";
  style?: CSSProperties;
}

/** The signature motif. Two geometries over one segment model; PromptLine and StatusLine compose it. */
export function SegmentBar({
  segments = [],
  shape = "powerline",
  style,
}: SegmentBarProps) {
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
