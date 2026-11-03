import Lenis from 'lenis'

let lenis = null
let locks = 0

const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function initSmoothScroll() {
  if (lenis || reducedMotion()) return () => {}
  lenis = new Lenis({ autoRaf: true, lerp: 0.09, wheelMultiplier: 0.95 })
  return () => {
    lenis?.destroy()
    lenis = null
  }
}

export function headerOffset() {
  return -(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64) + 1
}

let pending = null

export function scrollToTarget(target) {
  if (locks > 0) {
    pending = target
    return
  }
  const el = typeof target === 'string'
    ? (target === '#' || target === '#top' ? 0 : document.querySelector(target))
    : target
  if (el === null || el === undefined) return
  if (lenis) {
    lenis.scrollTo(el, { offset: el === 0 ? 0 : headerOffset(), duration: 1.4 })
  } else {
    const top = el === 0 ? 0 : el.getBoundingClientRect().top + window.scrollY + headerOffset()
    window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' })
  }
}

export function lockScroll() {
  locks += 1
  if (locks === 1) {
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks === 0) {
    lenis?.start()
    document.documentElement.style.overflow = ''
    if (pending !== null) {
      const target = pending
      pending = null
      requestAnimationFrame(() => scrollToTarget(target))
    }
  }
}
