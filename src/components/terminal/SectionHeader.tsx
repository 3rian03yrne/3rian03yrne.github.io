/**
 * Near-verbatim port of the design system's `typography/SectionHeader.jsx` (+ `.d.ts`).
 * See `.claude/standards/design-system-sync.md`'s 2026-08-12 scope decision.
 *
 * Genuinely new — this repo had no prior local port under any name. The name
 * `SectionHeader` was freed up by renaming the unrelated local list-divider to
 * `SectionDivider.astro`; this composes the real `Kicker` and `Heading` ports,
 * closing out the "page/panel opener" trio — see `terminal/README.md` section F3.
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
export function SectionHeader({ kicker, title, meta, small, style }: SectionHeaderProps) {
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
          <Kicker size={small ? "sm" : "lg"} style={{ marginBottom: "var(--space-2)" }}>
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
