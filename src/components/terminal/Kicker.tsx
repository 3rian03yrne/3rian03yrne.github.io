/**
 * Near-verbatim port of the design system's `typography/Kicker.jsx` (+ `.d.ts`).
 * See `.claude/standards/design-system-sync.md`'s 2026-08-12 scope decision.
 *
 * Genuinely new — this repo had no prior local port under any name (formerly
 * inlined ad hoc as the `.kicker` span in `SectionDivider.astro`), see
 * `terminal/README.md` section H.
 */
import type { CSSProperties, ReactNode } from "react";

export interface KickerProps {
  children?: ReactNode;
  /** sm 11px/0.18em · md 11px/0.2em · lg 13px/0.25em */
  size?: "sm" | "md" | "lg";
  color?: string;
  style?: CSSProperties;
}

const SIZES: Record<
  NonNullable<KickerProps["size"]>,
  { fontSize: string; letterSpacing: string }
> = {
  sm: { fontSize: "var(--text-kicker-sm)", letterSpacing: "var(--track-kicker-xs)" },
  md: { fontSize: "var(--text-kicker-sm)", letterSpacing: "var(--track-kicker-sm)" },
  lg: { fontSize: "var(--text-kicker)", letterSpacing: "var(--track-kicker)" },
};

/** ALL-CAPS Michroma eyebrow above a heading. Always letter-spaced. */
export function Kicker({ children, size = "md", color, style }: KickerProps) {
  return (
    <div
      style={{
        fontFamily: "var(--font-display)",
        color: color || "var(--text-dim)",
        textTransform: "uppercase",
        ...SIZES[size],
        ...style,
      }}
    >
      {children}
    </div>
  );
}
