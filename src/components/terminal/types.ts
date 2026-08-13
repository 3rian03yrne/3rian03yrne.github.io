/**
 * Prop types shared across more than one terminal component. Types used by a
 * single component live with it — `Segment` in SegmentBar.tsx,
 * `PromptSegment`/`PromptKind` in PromptLine.tsx.
 */

export type Tone = "primary" | "secondary" | "tertiary" | "dim";

export type ButtonVariant = "primary" | "secondary" | "ghost";
