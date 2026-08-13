/**
 * The eyebrow above a Heading. `SectionDivider.astro` still inlines its own
 * `.kicker` span rather than using this — the two are not kept in step.
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
  sm: {
    fontSize: "var(--text-kicker-sm)",
    letterSpacing: "var(--track-kicker-xs)",
  },
  md: {
    fontSize: "var(--text-kicker-sm)",
    letterSpacing: "var(--track-kicker-sm)",
  },
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
