import type { CSSProperties } from 'react';

interface LogoProps {
  /** Size in pixels (applies to both width and height) */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Na Quadra — Brand Logo (SVG)
 * Minimalist basketball icon with court-line aesthetic.
 * Orange brand color on transparent background.
 */
export function Logo({ size = 24, className, style }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {/* Ball */}
      <circle cx="16" cy="16" r="14" fill="var(--nq-brand-primary, #F5A623)" />

      {/* Seam lines */}
      <path
        d="M16 2a14 14 0 0 0 0 28M16 2a14 14 0 0 1 0 28"
        stroke="var(--nq-bg-primary, #0A0A0C)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="2"
        y1="16"
        x2="30"
        y2="16"
        stroke="var(--nq-bg-primary, #0A0A0C)"
        strokeWidth="1.5"
      />
      <path
        d="M16 2c-3.5 4-5.5 9-5.5 14s2 10 5.5 14"
        stroke="var(--nq-bg-primary, #0A0A0C)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M16 2c3.5 4 5.5 9 5.5 14s-2 10-5.5 14"
        stroke="var(--nq-bg-primary, #0A0A0C)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}
