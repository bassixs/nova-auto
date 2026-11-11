const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const ArrowRight = (p) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}>
    <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" {...base} />
  </svg>
)

export const ArrowLeft = (p) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}>
    <path d="M13.5 8h-11M7 3.5 2.5 8 7 12.5" {...base} />
  </svg>
)

export const ArrowUpRight = (p) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}>
    <path d="M4 12 12 4M5.5 4H12v6.5" {...base} />
  </svg>
)

export const Close = (p) => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" {...p}>
    <path d="M4 4l12 12M16 4 4 16" {...base} />
  </svg>
)

export const Plus = (p) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}>
    <path d="M7 1.5v11M1.5 7h11" {...base} />
  </svg>
)

export const Minus = (p) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}>
    <path d="M1.5 7h11" {...base} />
  </svg>
)

export const Phone = (p) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" {...p}>
    <path d="M4.2 1.8h2.4l1.2 3.6-1.8 1.2a9 9 0 0 0 5.4 5.4l1.2-1.8 3.6 1.2v2.4a1.8 1.8 0 0 1-1.8 1.8A13.2 13.2 0 0 1 2.4 3.6a1.8 1.8 0 0 1 1.8-1.8z" {...base} />
  </svg>
)

export const Copy = (p) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1" {...base} />
    <path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" {...base} />
  </svg>
)

export const Expand = (p) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" {...p}>
    <path d="M11 2.5h4.5V7M7 15.5H2.5V11M15.5 2.5 10.5 7.5M2.5 15.5l5-5" {...base} />
  </svg>
)

export const Check = (p) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}>
    <path d="M2.5 7.5 5.5 10.5 11.5 3.5" {...base} />
  </svg>
)

export const Pin = (p) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}>
    <path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 0 0-9 0c0 3.8 4.5 8 4.5 8z" {...base} />
    <circle cx="8" cy="6.5" r="1.6" {...base} />
  </svg>
)

export const Clock = (p) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}>
    <circle cx="8" cy="8" r="6" {...base} />
    <path d="M8 4.5V8l2.2 1.6" {...base} />
  </svg>
)

export const Info = (p) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" {...p}>
    <circle cx="9" cy="9" r="7" {...base} />
    <path d="M9 8.2v4.3M9 5.4v.4" {...base} />
  </svg>
)

export const Star = (p) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" {...p}>
    <path d="m8 1.8 1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6z" fill="currentColor" />
  </svg>
)
