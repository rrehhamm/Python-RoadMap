import type { Availability } from '../lib/progress'

/**
 * Status glyph. Each state has a distinct shape (check, half-fill, ring,
 * padlock) so the state never depends on colour alone.
 */
export function StatusIcon({ status, size = 16 }: { status: Availability; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': true, className: `sicon sicon--${status}` }
  switch (status) {
    case 'completed':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="7" fill="currentColor" />
          <path d="M4.8 8.2l2.1 2.1 4.3-4.6" fill="none" stroke="var(--on-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'in_progress':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 3.5a4.5 4.5 0 0 1 0 9z" fill="currentColor" />
        </svg>
      )
    case 'available':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'locked':
      return (
        <svg {...common}>
          <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )
  }
}
