/**
 * Shared prop types for the terminal components.
 *
 * These are ports of the design system's React components
 * (`_ds/padd-terminal-design-system-.../_ds_bundle.js`) to zero-JS Astro
 * components. The visual language lives in each component's scoped <style>
 * block, driven entirely by the tokens in src/styles/tokens/ — pages compose
 * them with Tailwind utilities for layout.
 */

export type Tone = "primary" | "secondary" | "tertiary" | "dim";

export type ButtonVariant = "primary" | "secondary" | "ghost";
