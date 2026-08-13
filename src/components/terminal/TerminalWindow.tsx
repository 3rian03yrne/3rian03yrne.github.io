/**
 * Near-verbatim port of the design system's `console/TerminalWindow.jsx` (+ `.d.ts`).
 * See `.claude/standards/design-system-sync.md`'s 2026-08-12 scope decision.
 *
 * `className` is a local addition upstream doesn't have (its escape hatch is
 * a generic `style` passthrough only) — kept alongside `width` because
 * `FeaturedEntry.astro`'s `:global(.preview)` rule needs to select into this
 * component's root element from outside. Named `className`, not `class` like
 * `Button.tsx`/`SegmentBar.tsx`/`PromptLine.tsx` use for the same escape
 * hatch: Astro's compiler does not forward a literal `class="…"` attribute
 * written on a non-Astro (framework) component invocation — confirmed by
 * reading the actual props a component receives, `class` is silently
 * dropped, only `className="…"` written at the call site arrives as a prop.
 * See `terminal/README.md`'s F2 resolution note.
 */
import type { CSSProperties, ReactNode } from "react";

export interface TerminalWindowProps {
  /** centered chrome caption, e.g. "zsh" or "~/uss-cerritos". Default "zsh" */
  title?: string;
  /** fixed width; omit to fill the container */
  width?: number | string;
  children?: ReactNode;
  style?: CSSProperties;
  /** Local addition — see file doc comment. */
  className?: string;
}

const DOT: CSSProperties = {
  width: 11,
  height: 11,
  borderRadius: "var(--radius-dot)",
};

/** Floating terminal window — themed traffic dots, void body, the system's only shadow. */
export function TerminalWindow({
  title = "zsh",
  width,
  children,
  style,
  className,
}: TerminalWindowProps) {
  return (
    <div
      className={className}
      style={{
        borderRadius: "var(--radius-term)",
        overflow: "hidden",
        boxShadow: "var(--shadow-term)",
        width,
        fontFamily: "var(--font-mono)",
        // Not in the source component: its body sits on --surface-void, the
        // same colour as the page, so without a hairline the window has no
        // edge once it's out of the design doc's bordered card.
        border: "var(--border-hairline)",
        ...style,
      }}
    >
      <div
        style={{
          background: "var(--surface-panel)",
          padding: "var(--pad-chrome)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
        }}
      >
        <div style={{ ...DOT, background: "var(--dot-1)" }} />
        <div style={{ ...DOT, background: "var(--dot-2)" }} />
        <div style={{ ...DOT, background: "var(--dot-3)" }} />
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "var(--text-kicker-sm)",
            color: "var(--text-dim)",
            letterSpacing: "var(--track-caps)",
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          background: "var(--surface-void)",
          padding: "var(--pad-terminal)",
          fontSize: "var(--text-term)",
          lineHeight: "var(--leading-term)",
          color: "var(--text-1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
