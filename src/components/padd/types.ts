/**
 * Shared prop types for the PADD Terminal components.
 *
 * These are ports of the design system's React components
 * (`_ds/padd-terminal-design-system-.../_ds_bundle.js`) to zero-JS Astro
 * components. The visual language lives in each component's scoped <style>
 * block, driven entirely by the tokens in src/styles/tokens/ — pages compose
 * them with Tailwind utilities for layout.
 */

export type Tone = 'primary' | 'secondary' | 'tertiary' | 'dim';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/** One cell of a powerline bar. */
export interface Segment {
	/** Segment text. Ignored when `parts` is given. */
	label?: string;
	/** Rendered joined by a dimmed `|`, as in the status line's middle cell. */
	parts?: string[];
	bg?: string;
	fg?: string;
	weight?: number;
	padding?: string;
	radius?: string;
	/** A `polygon()` for the powerline slant, e.g. var(--pl-slant-lead). */
	clip?: string;
	/** Pull left by --pl-overlap so a slanted neighbour tucks under this cell. */
	overlap?: boolean;
}

/** The kinds of prompt cell the design system defines. */
export type PromptKind = 'path' | 'git' | 'ok' | 'time';

export interface PromptSegment {
	label: string;
	kind?: PromptKind;
}
