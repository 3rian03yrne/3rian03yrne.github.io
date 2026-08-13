/**
 * Near-verbatim port of the design system's `primitives/Button.jsx` (+ `.d.ts`).
 * See `.claude/standards/design-system-sync.md`'s 2026-08-12 scope decision.
 *
 * Upstream drives hover/press off React state (setHover/setPress on mouse
 * events) — kept CSS-only here instead (Button.module.css), so this stays
 * zero-JS with no client directive, same result either way.
 *
 * `href` is a deliberate local addition upstream doesn't have (it's
 * onClick-only) — every real call site needs actual page navigation, so this
 * renders <a href> when given, <button> otherwise. Not a gap to close.
 */
import type { CSSProperties, ReactNode } from "react";
import type { ButtonVariant } from "./types";
import styles from "./Button.module.css";

export interface ButtonProps {
  children: ReactNode;
  /** primary (accent fill, default) · secondary (accent-2 fill) · ghost (hairline outline) */
  variant?: ButtonVariant;
  size?: "sm" | "md";
  disabled?: boolean;
  /** Renders an <a> when given, a <button> otherwise. Local addition — see file doc comment. */
  href?: string;
  /**
   * Local addition upstream doesn't have — kept alongside `style` as the
   * escape hatch. Named `className`, not `class`: Astro's compiler doesn't
   * forward a literal `class="…"` attribute written on a non-Astro
   * (framework) component invocation, only `className="…"` arrives as a
   * prop. Confirmed while porting TerminalWindow.tsx — see
   * `terminal/README.md`'s F2 resolution note.
   */
  className?: string;
}

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "var(--accent)",
    color: "var(--status-lead-fg)",
    border: "1px solid transparent",
  },
  secondary: {
    background: "var(--accent-2)",
    color: "var(--ink-on-accent)",
    border: "1px solid transparent",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-1)",
    border: "1px solid var(--surface-chip)",
  },
};

/** Console action button — mono uppercase, segment-shaped. */
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled,
  href,
  className,
}: ButtonProps) {
  const pad = size === "sm" ? "5px 14px" : "8px 22px";
  const fs = size === "sm" ? "var(--text-kicker-sm)" : "var(--text-code)";
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    fontSize: fs,
    letterSpacing: "var(--track-caps)",
    textTransform: "uppercase",
    padding: pad,
    borderRadius: "var(--radius-seg)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    textDecoration: "none",
    transition: "filter 120ms ease",
    ...VARIANTS[variant],
  };

  const classes = [styles.btn, className].filter(Boolean).join(" ");

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        style={style}
        aria-disabled={disabled ? "true" : undefined}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} style={style} disabled={disabled}>
      {children}
    </button>
  );
}
