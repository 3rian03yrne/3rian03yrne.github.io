/**
 * Floating terminal window. `className` exists because
 * `FeaturedEntry.astro`'s `:global(.preview)` rule needs to select into this
 * component's root element from outside.
 *
 * It has to be named `className`, not `class`: Astro's compiler does not
 * forward a literal `class="…"` attribute written on a non-Astro (framework)
 * component invocation — confirmed by reading the actual props object a
 * component receives during a build, `class` is silently dropped, only
 * `className="…"` written at the call site arrives as a prop. Nothing errors
 * and the build stays green, so this fails invisibly. See
 * `terminal/README.md`.
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
        // The body sits on --surface-void, the same colour as the page, so
        // without this hairline the window has no edge at all outside a
        // bordered container.
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
