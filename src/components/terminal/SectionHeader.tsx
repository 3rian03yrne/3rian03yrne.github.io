/**
 * The page/panel opener: composes the real `Kicker` and `Heading` rather than
 * reimplementing either.
 *
 * Not to be confused with `SectionDivider.astro`, which is an unrelated
 * list-section divider — it held this name first and was renamed to free it.
 */
import type { CSSProperties } from "react";
import { Kicker } from "./Kicker";
import { Heading } from "./Heading";

export interface SectionHeaderProps {
  /** ALL-CAPS eyebrow, e.g. "BRIDGE CONSOLE · COOL" */
  kicker?: string;
  title?: string;
  /** right-aligned telemetry, e.g. "STARDATE 57436.2" */
  meta?: string;
  /** compact variant for panel headers */
  small?: boolean;
  style?: CSSProperties;
}

/** Kicker + Heading + right-aligned metadata. The standard section opener. */
export function SectionHeader({
  kicker,
  title,
  meta,
  small,
  style,
}: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "var(--space-4)",
        ...style,
      }}
    >
      <div>
        {kicker && (
          <Kicker
            size={small ? "sm" : "lg"}
            style={{ marginBottom: "var(--space-2)" }}
          >
            {kicker}
          </Kicker>
        )}
        {title && <Heading level={small ? 2 : 1}>{title}</Heading>}
      </div>
      {meta && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-code)",
            color: "var(--text-dim)",
            letterSpacing: "0.08em",
          }}
        >
          {meta}
        </div>
      )}
    </div>
  );
}
