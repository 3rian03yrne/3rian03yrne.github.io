/**
 * Near-verbatim port of the design system's `console/PromptLine.jsx` (+ `.d.ts`).
 * See `.claude/standards/design-system-sync.md`'s 2026-08-12 scope decision.
 *
 * A kind-driven composition over SegmentBar.
 */
import type { CSSProperties } from "react";
import { SegmentBar, type Segment } from "./SegmentBar";

export type PromptKind = "path" | "git" | "ok" | "time";

export interface PromptSegment {
  label: string;
  /** path = accent block · git = chip · ok = success block · time = transparent trailer */
  kind?: PromptKind;
}

export interface PromptLineProps {
  /** defaults to ~/site · ⎇ main · ✓ · 184ms */
  segments?: PromptSegment[];
  /** powerline = butted blocks (starship/Oh My Posh) · pill = detached capsules */
  shape?: "powerline" | "pill";
  style?: CSSProperties;
}

const KIND_STYLES: Record<PromptKind, Omit<Segment, "label">> = {
  path: {
    bg: "var(--prompt-path-bg)",
    fg: "var(--prompt-path-fg)",
    weight: 700,
    padding: "5px 16px",
    radius: "var(--radius-seg) 0 0 var(--radius-seg)",
  },
  git: {
    bg: "var(--prompt-git-bg)",
    fg: "var(--prompt-git-fg)",
    weight: 500,
    padding: "5px 16px",
  },
  ok: {
    bg: "var(--prompt-ok-bg)",
    fg: "var(--prompt-ok-fg)",
    weight: 700,
    padding: "5px 14px",
    radius: "0 var(--radius-seg) var(--radius-seg) 0",
  },
  time: {
    fg: "var(--text-dim)",
    weight: 400,
    padding: "5px 8px",
  },
};

const DEFAULT_SEGMENTS: PromptSegment[] = [
  { label: "~/site", kind: "path" },
  { label: "⎇ main", kind: "git" },
  { label: "✓", kind: "ok" },
  { label: "184ms", kind: "time" },
];

/** Shell prompt. A kind-driven composition over SegmentBar. */
export function PromptLine({
  segments = DEFAULT_SEGMENTS,
  shape = "powerline",
  style,
}: PromptLineProps) {
  return (
    <SegmentBar
      shape={shape}
      style={style}
      segments={segments.map((s) => ({
        label: s.label,
        ...KIND_STYLES[s.kind ?? "time"],
      }))}
    />
  );
}
