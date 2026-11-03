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

export const Close = (p) => (
  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" {...p}>
    <path d="M4 4l12 12M16 4 4 16" {...base} />
  </svg>
)

export const Plus = (p) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...p}>
    <path d="M7 1v12M1 7h12" {...base} />
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
