/**
 * Public API for the terminal component set.
 *
 * Import from here rather than reaching at individual files — this is the
 * surface that is meant to be stable, and keeping it in one place makes
 * "what does this set expose" a reviewable question.
 *
 * Every component here is presentational: no client-side state, no `client:*`
 * directive, rendered to static HTML at build time. They are styled entirely
 * through the CSS custom properties declared in `src/styles/tokens/` — those
 * tokens are a hard dependency, not an optional theme layer.
 */

// React components.
export { Button, type ButtonProps } from "./Button";
export { Heading, type HeadingProps } from "./Heading";
export { Kicker, type KickerProps } from "./Kicker";
export {
  PromptLine,
  type PromptLineProps,
  type PromptKind,
  type PromptSegment,
} from "./PromptLine";
export { SectionHeader, type SectionHeaderProps } from "./SectionHeader";
export { SegmentBar, type Segment, type SegmentBarProps } from "./SegmentBar";
export { StatusLine, type StatusLineProps } from "./StatusLine";
export { TerminalWindow, type TerminalWindowProps } from "./TerminalWindow";

// Astro components. These re-export cleanly because `.astro/types.d.ts`
// declares the `*.astro` module shape, so both `astro check` and the build
// resolve them through this barrel the same as a direct import would.
export { default as AutomationIcon } from "./AutomationIcon.astro";
export { default as FeaturedEntry } from "./FeaturedEntry.astro";
export { default as PageBanner } from "./PageBanner.astro";
export { default as Pill } from "./Pill.astro";
export { default as SectionDivider } from "./SectionDivider.astro";
export { default as SegmentRule } from "./SegmentRule.astro";
export { default as StreamItem } from "./StreamItem.astro";
export { default as ThemeToggle } from "./ThemeToggle.astro";

// Shared prop vocabulary.
export type { Tone, ButtonVariant } from "./types";
