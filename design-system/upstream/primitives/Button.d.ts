/**
 * Console action button — mono uppercase, segment-shaped. Intentional addition (source has no buttons); derived from the prompt-segment language.
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** primary (accent fill, default) · secondary (periwinkle/mauve fill) · ghost (hairline outline) */
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
