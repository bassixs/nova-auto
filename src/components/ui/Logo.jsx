import { brandUrl } from '../../lib/images'

// Утверждённый логотип используется как есть: полный знак и фрагмент с надписью, без перерисовки.

export function LogoMark({ className = '', sizes = '(min-width: 768px) 460px, 72vw', priority = false, onLoad }) {
  return (
    <img
      src={brandUrl('logo-640.webp')}
      srcSet={`${brandUrl('logo-640.webp')} 640w, ${brandUrl('logo-1254.webp')} 1254w`}
      sizes={sizes}
      width="1254"
      height="1254"
      alt="Логотип DARK VISION"
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable="false"
      onLoad={onLoad}
    />
  )
}

export function Wordmark({ className = '' }) {
  return (
    <img
      src={brandUrl('wordmark.webp')}
      width="916"
      height="102"
      alt="DARK VISION"
      className={`wordmark ${className}`}
      decoding="async"
      draggable="false"
    />
  )
}
