/**
 * The system's title face. Distinct from `PageBanner.astro`, which sizes its
 * own clamp()-scaled index-page title rather than using this.
 */
import type { CSSProperties, ReactNode } from "react";

export interface HeadingProps {
  children?: ReactNode;
  /** 1 = 40px display · 2 = 26px panel title */
  level?: 1 | 2;
  color?: string;
  style?: CSSProperties;
}

/** Michroma title. Two sizes only — the system has no h3+. */
export function Heading({ children, level = 1, color, style }: HeadingProps) {
  const Tag = level === 1 ? "h1" : "h2";
  const fontSize =
    level === 1 ? "var(--text-display)" : "var(--text-panel-title)";
  const letterSpacing =
    level === 1 ? "var(--track-display)" : "var(--track-panel)";

  return (
    <Tag
      style={{
        fontFamily: "var(--font-display)",
        fontSize,
        lineHeight: "var(--leading-display)",
        letterSpacing,
        color: color || "var(--text-1)",
        margin: 0,
        fontWeight: 400,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
